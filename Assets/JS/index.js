document.addEventListener('DOMContentLoaded', function () {
    const filezone = document.getElementById('pdf-filezone');
    const modal = document.getElementById('modal-container');
    const closeModalButton = document.getElementById('close-modal');
    const pdfInfo = document.getElementById('pdf-info');
    const okButton = document.getElementById('ok-button');
    const downloadButton = document.getElementById('download-button');

    let uploadedFile;
    let pagesBase64 = [];

    // Seção do listeners de evento dos BOTÕES da pagina.

    closeModalButton.addEventListener('click', closeModal);
    okButton.addEventListener('click', async () => {
        await fetchPdfPages();
        
        closeModal();
    });
    downloadButton.addEventListener('click', downloadZip);

    // Funções basicas de abertura e fechamento do MODAL.

    function openModal() {
        modal.style.display = 'flex';
    }
    function closeModal() {
        modal.style.display = 'none';
    }
    

    // Seção do listeners de eventos para o DRAG AND DROP do arquivo PDF a ser trabalhado.

    filezone.addEventListener('dragover', (event) => {
        event.preventDefault();
        filezone.classList.add('hover');
    });
    filezone.addEventListener('dragleave', () => {
        filezone.classList.remove('hover');
    });
    filezone.addEventListener('drop', (event) => {
        event.preventDefault();
        filezone.classList.remove('hover');

        const files = event.dataTransfer.files;

        if (files.length !== 1) {
            alert('Por favor, solte apenas um arquivo PDF.');
            return;
        }

        const file = files[0];

        if (file && file.type === 'application/pdf') {
            uploadedFile = file;

            const reader = new FileReader();

            reader.onload = function (e) {
                const arrayBuffer = e.target.result;

                openModal();
                showPDFData(file);
                showPDFPreview(arrayBuffer);
            };
            reader.readAsArrayBuffer(file);
        } else {alert('Por favor, solte um arquivo PDF.');}
    });

    // Função para mostrar dados básicos do PDF no MODAL.

    function showPDFData(file) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        const fileInfo = `
            <p><strong>Nome:</strong> ${file.name}</p>
            <p><strong>Tamanho:</strong> ${fileSize} MB</p>
            <p><strong>Tipo:</strong> ${file.type}</p>
        `;

        pdfInfo.innerHTML = fileInfo;
    }

    // Função para exibir a visualização da primeira página do PDF.

    function showPDFPreview(arrayBuffer) {
        const pdfjsLib = window['pdfjs-dist/build/pdf'];

        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

        loadingTask.promise.then(function (pdf) {
            pdf.getPage(1).then(function (page) {
                const scale = 0.25;
                const viewport = page.getViewport({ scale: scale });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                page.render(renderContext).promise.then(function () {
                    pdfInfo.appendChild(canvas);
                });
            });
        }, function (reason) {console.error(reason);});
    }

    // Função Asincrona para enviar o PDF para API e receber de volta as paginas do PDF em Base 64.

    async function fetchPdfPages() {
        if (!uploadedFile) {
            alert('Nenhum arquivo foi carregado!');

            return;
        }

        const formData = new FormData();

        formData.append('pdf', uploadedFile);

        try {
            const response = await fetch('http://localhost:5000/process_pdf', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            console.log(result);

            if (Array.isArray(result)) {
                pagesBase64 = result;
            } else {
                console.error('A resposta não é um array:', result);

                alert('Erro: A resposta do servidor não contém as páginas esperadas.');
            }
        } catch (error) {console.error('Erro ao enviar o arquivo:', error);}
    }
    
    // Função para baixar um arquivo ZIP com todas as paginas separadas do PDF.

    function downloadZip() {
        if (pagesBase64.length === 0) {
            alert('Nenhuma página foi carregada. Por favor, carregue um PDF primeiro.');

            return;
        }
        const zip = new JSZip();

        pagesBase64.forEach((pageBase64, index) => {
            try {
                const base64Content = pageBase64.replace(/[^A-Za-z0-9+/=]/g, '');
                const binaryString = atob(base64Content);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);

                for (let i = 0; i < len; i++) {bytes[i] = binaryString.charCodeAt(i);}  

                zip.file(`${uploadedFile.name.replace(".pdf", "")}_${index + 1}.pdf`, bytes, { binary: true }); 
            } catch (error) {console.error('Erro ao adicionar a página ao zip:', error);}});
        zip.generateAsync({ type: "blob" })
            .then(content => {
                const link = document.createElement('a');

                link.href = URL.createObjectURL(content);
                link.download = `${uploadedFile.name.replace(".pdf", "")}_SPLITTED.zip`;
                link.click();
            })
            .catch(error => {console.error('Erro ao gerar o zip:', error);});
    }
});
