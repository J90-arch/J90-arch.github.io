function simulate(config) {
  const slots = 100, samples = 256, users = Math.max(1, Math.round(config.load * slots / config.replicas));
  const snr = 10 ** (config.snr / 10), amplitude = Math.sqrt(snr);
  let state = (config.seed + 1) >>> 0;
  function random() { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; }
  function gaussian() { return Math.sqrt(-2 * Math.log(Math.max(random(), 1e-12))) * Math.cos(2 * Math.PI * random()); }
  const signals = Array.from({length: slots}, () => new Float32Array(samples * 2));
  const occupancy = Array.from({length: slots}, () => []);
  const packetSlots = [], symbols = [], amplitudes = [];
  for (let packet = 0; packet < users; packet++) {
    const chosen = new Set();
    while (chosen.size < config.replicas) chosen.add(Math.floor(random() * slots));
    packetSlots.push([...chosen]);
    const chips = Int8Array.from({length: samples}, () => random() < 0.5 ? -1 : 1);
    symbols.push(chips);
    const powers = new Float32Array(slots);
    amplitudes.push(powers);
    for (const slot of chosen) {
      const gain = amplitude * 10 ** (gaussian() * 0.5 / 20);
      const phase = random() * 2 * Math.PI;
      powers[slot] = gain;
      occupancy[slot].push(packet);
      const real = gain * Math.cos(phase), imag = gain * Math.sin(phase), signal = signals[slot];
      for (let index = 0; index < samples; index++) {
        signal[2 * index] += real * chips[index];
        signal[2 * index + 1] += imag * chips[index];
      }
    }
  }
  for (const signal of signals) for (let index = 0; index < samples; index++) {
    signal[2 * index] += gaussian() / Math.SQRT2;
    signal[2 * index + 1] += gaussian() / Math.SQRT2;
  }
  function slotSinr(slot, packet, decoded) {
    let interference = 1;
    for (const other of occupancy[slot]) if (other !== packet && !decoded.has(other)) interference += amplitudes[other][slot] ** 2;
    return amplitudes[packet][slot] ** 2 * samples / interference;
  }
  function sicPass(decoded, trace, stage) {
    let added = 0;
    for (let slot = 0; slot < slots; slot++) {
      const alive = occupancy[slot].filter(packet => !decoded.has(packet));
      if (alive.length !== 1 || decoded.has(alive[0]) || slotSinr(slot, alive[0], decoded) < config.threshold) continue;
      decoded.add(alive[0]); added++;
      if (trace) trace.push({stage, packet: alive[0], slots: packetSlots[alive[0]]});
    }
    return added;
  }
  const aloha = new Set();
  for (let slot = 0; slot < slots; slot++) if (occupancy[slot].length === 1 && slotSinr(slot, occupancy[slot][0], aloha) >= config.threshold) aloha.add(occupancy[slot][0]);
  const crdsa = new Set();
  while (sicPass(crdsa, null, "sic")) {}
  function energy(slot) {
    let total = 0; for (const value of signals[slot]) total += value * value;
    return total;
  }
  const energies = signals.map((_, slot) => energy(slot));
  function correlation(first, second) {
    const left = signals[first], right = signals[second];
    let real = 0, imag = 0;
    for (let index = 0; index < samples; index++) {
      const ar = left[2 * index], ai = left[2 * index + 1], br = right[2 * index], bi = right[2 * index + 1];
      real += ar * br + ai * bi; imag += ar * bi - ai * br;
    }
    return Math.hypot(real, imag) / Math.sqrt(energies[first] * energies[second]);
  }
  function matched(slot, packet) {
    let real = 0, imag = 0;
    const signal = signals[slot], chips = symbols[packet];
    for (let index = 0; index < samples; index++) { real += signal[2 * index] * chips[index]; imag += signal[2 * index + 1] * chips[index]; }
    return Math.hypot(real, imag) / samples;
  }
  function combinedSinr(replicaSlots, packet, decoded) {
    let signal = 0, residual = 0;
    for (const slot of replicaSlots) {
      signal += amplitudes[packet][slot]; residual++;
      for (const other of occupancy[slot]) if (other !== packet && !decoded.has(other)) residual += amplitudes[other][slot] ** 2;
    }
    return signal * signal / residual;
  }
  const decoded = new Set(), trace = [];
  let correlations = 0, round = 0;
  while (decoded.size < users) {
    while (sicPass(decoded, trace, "sic")) {}
    const collided = [];
    for (let slot = 0; slot < slots; slot++) if (occupancy[slot].filter(packet => !decoded.has(packet)).length >= 2) collided.push(slot);
    if (!collided.length) break;
    collided.sort((first, second) => energies[second] - energies[first]);
    let progress = false;
    for (const reference of collided) {
      const coupled = [];
      for (const slot of collided) if (slot !== reference) {
        correlations++;
        if (correlation(reference, slot) >= 0.08) coupled.push(slot);
      }
      for (const packet of occupancy[reference]) {
        if (decoded.has(packet)) continue;
        const replicas = [reference, ...coupled.filter(slot => matched(slot, packet) >= 0.5 * amplitude)];
        if (replicas.length < 2 || combinedSinr(replicas, packet, decoded) < config.threshold) continue;
        decoded.add(packet); progress = true;
        trace.push({stage: "marsala", packet, slots: packetSlots[packet]});
      }
      if (progress) break;
    }
    if (!progress) break;
    round++;
  }
  return {occupancy: occupancy.map(packets => packets.length), users, load: users * config.replicas / slots,
    counts: [aloha.size, crdsa.size, decoded.size], extra: decoded.size - crdsa.size, correlations, trace};
}
if (typeof module !== "undefined") module.exports = {simulate};
