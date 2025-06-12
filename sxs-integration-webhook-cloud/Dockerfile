# Use a imagem base oficial do Node.js
FROM node:18-slim

# Crie e defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências da aplicação
# Se você tiver dependências de desenvolvimento que não precisa em produção,
# considere --only=production
RUN npm install

# Copie o restante do código da aplicação para o diretório de trabalho
COPY . .

# Sua aplicação escuta na porta definida pela variável de ambiente PORT
# O Functions Framework faz isso automaticamente.
# O Cloud Run define PORT como 8080 por padrão se não especificado de outra forma.
# Apenas execute o comando de start
CMD ["npm", "start"]