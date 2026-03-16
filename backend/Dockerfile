FROM node:20-alpine
WORKDIR /app

# ก๊อปปี้ไฟล์ package จากโฟลเดอร์ที่ Docker กำลังทำงานอยู่
COPY package*.json ./
RUN npm install

# ก๊อปปี้โค้ดทั้งหมด (ที่อยู่ใน context) มาลงใน /app
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
