// Hardcoded list of PDF files in the 'docs/' folder
const pdfFiles = [
    'docs/doc1.pdf',
    'docs/doc2.pdf'
];

// Initialize the menu with document links
window.onload = function() {
    const fileList = document.getElementById('file-list');
    
    pdfFiles.forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Document ${index + 1}`;
        listItem.addEventListener('click', () => loadPDF(file));
        fileList.appendChild(listItem);
    });

    // Load the first document by default
    if (pdfFiles.length > 0) {
        loadPDF(pdfFiles[0]);
    }
};

// Load and render the PDF using PDF.js
function loadPDF(url) {
    const pdfCanvas = document.getElementById('pdf-canvas');
    const ctx = pdfCanvas.getContext('2d');

    // Load the PDF
    pdfjsLib.getDocument(url).promise.then(pdf => {
        // Get the first page of the PDF
        pdf.getPage(1).then(page => {
            const scale = 1.5;  // Use a fixed scale for now
            const viewport = page.getViewport({ scale: scale });

            // Match canvas size exactly to the PDF page
            pdfCanvas.width = viewport.width;
            pdfCanvas.height = viewport.height;

            // Render the page on the canvas
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            page.render(renderContext);
        });
    }).catch(error => {
        console.error('Error loading PDF:', error);
    });
}
