# FRONT_PDF_SPLITTER

Este é um simples projeto de FRONT END para utiliza minha API que separa as paginas de um arquivo PDF.

Utiliza um sistema drag and drop do arquivo, uma vizualização em modal do PDF.

Este projeto em via uma requisição POST com um arquivo PDF no form data, e recebe da API um ARRAY das paginas do PDF em BASE 64,
por converte as paginas de volta em PDF e prepara um arquivo ZIP, para baixar elas.