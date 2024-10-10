<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="Assets\CSS\index.css">
    <title>PDF SPLITTER</title>
</head>
<body>
    <div class="main-container" id="main-container">
        <div class="pdf-filezone" id="pdf-filezone">
            <span>PDF DROPZONE</span>
        </div>

        <button class="download-button" id="download-button">DOWNLOAD SPLITTED PAGES</button>
    </div>

    <div class="modal-container" id="modal-container">
        <div class="pdf-infozone" id="pdf-infozone">
            <div id="pdf-info"></div>
            
            <button class="ok-button" id="ok-button">OK</button>
            <button class="close-modal" id="close-modal">CANCEL</button>
        </div>
    </div>

    <script src="Assets\JS\index.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
</body>
</html>