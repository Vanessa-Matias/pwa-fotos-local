# Relatório da Atividade: PWA com Câmera, Geolocalização e API
Este documento descreve o projeto desenvolvido para a atividade, que consiste em um Progressive Web App (PWA) simples para registrar fotos associadas a uma localização geográfica.

## Descrição do Projeto
O aplicativo permite que o usuário:

* Tire ou selecione uma foto usando a câmera do dispositivo ou a galeria de imagens.

* Capture a geolocalização (latitude e longitude) atual com o GPS do dispositivo.

* Consulte uma API pública (Nominatim) para obter o endereço aproximado com base nas coordenadas.

* Salve os registros (foto + localização + endereço) localmente no navegador (localStorage), permitindo o funcionamento offline.

* Instale o aplicativo na tela inicial do dispositivo, como um PWA nativo.

* Exporte todos os registros salvos como um arquivo JSON.

## Atendimento aos Requisitos da Atividade
O projeto atende a todos os requisitos solicitados, conforme detalhado abaixo:

### 1. Progressive Web App (PWA)
O aplicativo foi construído seguindo os princípios de um PWA, garantindo uma experiência rica e confiável:

- Manifest (manifest.json): Fornece os metadados para a instalação do app, como nome, ícones, cores de tema e comportamento de inicialização.

- Service Worker (sw.js): Atua como um proxy de rede, gerenciando o cache dos arquivos principais (app shell). Isso garante que o aplicativo possa ser carregado e utilizado mesmo sem conexão com a internet.

- Instalável: O navegador oferece a opção de "Instalar" o aplicativo na tela inicial do dispositivo, graças ao evento beforeinstallprompt que é capturado e utilizado para exibir um botão de instalação.

### 2. Uso de Recurso de Hardware
O aplicativo acessa diretamente o hardware do dispositivo de duas formas principais:

- Câmera: Utiliza o input de arquivo com o atributo capture="environment", que prioriza a abertura da câmera traseira em dispositivos móveis.

<input id="fileInput" type="file" accept="image/*" capture="environment" style="display:none">

- Geolocalização (GPS): Acessa a localização precisa do usuário através da API navigator.geolocation, solicitando a permissão necessária para garantir a privacidade.

navigator.geolocation.getCurrentPosition(async (pos) => {
  // ...código para obter latitude e longitude
}, (err) => {
  // ...tratamento de erro de permissão ou falha
}, { enableHighAccuracy: true });

### 3. Consumo de API Pública
Para converter as coordenadas geográficas (latitude e longitude) em um endereço legível, o aplicativo consome a API pública e gratuita Nominatim, que utiliza os dados do OpenStreetMap.

Chamada fetch: Uma requisição GET é feita para o endpoint de reverse geocoding da API, passando as coordenadas como parâmetros para obter o endereço formatado.

const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
const res = await fetch(url);
const data = await res.json();
const address = data.display_name;

## Como Executar o Projeto
* Crie uma pasta e salve os arquivos index.html, sw.js e manifest.json.

* Abra um terminal na pasta do projeto.

* Inicie um servidor web local. Exemplo com Python 3:

* python -m http.server 8000

* Acesse http://localhost:8000 em um navegador no computador ou http://<seu-ip-local>:8000 em um celular conectado à mesma rede Wi-Fi.

## Screenshots Sugeridos para Entrega
Para documentar a entrega da atividade, sugere-se anexar os seguintes screenshots:

- Tela Principal: A interface inicial do aplicativo, mostrando os botões de ação e a lista de registros vazia.

Diálogo de Permissão: A caixa de diálogo do navegador solicitando permissão para acessar a localização do usuário.

Registro Salvo: A tela após tirar uma foto, obter a localização e salvar um registro, mostrando o novo item na lista de "Registros salvos" com a imagem, data e endereço.
