FROM node:22-alpine

WORKDIR /app

# الإصدار مثبّت عمداً ليطابق حقل packageManager في جذر المشروع.
# تركه بلا تثبيت يجعل كل بناء يسحب أحدث pnpm، فقد يكسر إصدارٌ كبيرٌ
# جديد البناءَ دون أي تغيير في الكود.
RUN npm install -g pnpm@9.15.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY . .

EXPOSE 6431

CMD ["node", "server.js"]