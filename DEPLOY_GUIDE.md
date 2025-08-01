## 🚀 Guia de Deploy - Ranhentos Idiomas (v3 - Render Otimizado)

## 📋 Resumo
Este guia mostra como fazer o deploy do seu sistema de gestão escolar no **Vercel** (frontend) e **Render** (backend).

⚠️ **ÚLTIMAS CORREÇÕES:**
- Backend: Dockerfile simplificado com PHP built-in server (mais compatível com Render)
- Removido Apache para evitar conflitos FPM/Apache  
- Configuração otimizada para detecção de portas HTTP
- Frontend: vercel.json simplificado para React SPA

## 🎯 Frontend no Vercel

### 1. Preparação dos arquivos
✅ Configuração de variáveis de ambiente criada (`.env` e `.env.example`)
✅ Arquivo `vercel.json` corrigido para SPA routing
✅ Services atualizados para usar `process.env.REACT_APP_API_BASE_URL`

### 2. Deploy no Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em "Add New..." → "Project"
3. Selecione o repositório `ranhentos-idiomas`
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. Adicione variável de ambiente:
   - **Name:** `REACT_APP_API_BASE_URL`
   - **Value:** `https://SEU-BACKEND-NAME.onrender.com/api/v1`
6. Deploy!

## 🎯 Backend no Render

### 1. Preparação dos arquivos
✅ `Dockerfile.render` otimizado com PHP built-in server  
✅ Removido Apache para compatibilidade com Render
✅ `.env.production` template criado
✅ CORS atualizado para usar variáveis de ambiente
✅ Dockerfile simplificado para melhor detecção de portas

### 2. Deploy no Render
1. Acesse [render.com](https://render.com) e faça login com GitHub
2. Clique em "New +" → "Web Service"
3. Conecte o repositório `ranhentos-idiomas`
4. Configure:
   - **Name:** `ranhentos-backend` (ou nome de sua escolha)
   - **Root Directory:** `backend`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `backend/Dockerfile.render`
   - **Port:** `80`

### 3. Variáveis de ambiente no Render
Adicione estas variáveis na seção "Environment":

```env
APP_NAME=Ranhentos Idiomas
APP_ENV=production
APP_DEBUG=false
APP_URL=https://SEU-BACKEND-NAME.onrender.com
APP_KEY=base64:UDQVTT2P/8VKvFsfIAwDKSAzjdFbxYPhiStF1hMXsjA=
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite
CORS_ALLOWED_ORIGINS=https://SEU-FRONTEND-NAME.vercel.app
LOG_LEVEL=error
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

**✅ APP_KEY já gerada:** Use a chave acima ou gere uma nova com:
```bash
php artisan key:generate --show
```

## 🔄 Configuração Final

### 1. Atualize as URLs
Após o deploy dos dois serviços:

**No Vercel:**
- Vá em Settings → Environment Variables
- Atualize `REACT_APP_API_BASE_URL` com a URL real do Render
- Exemplo: `https://ranhentos-backend.onrender.com/api/v1`

**No Render:**
- Vá em Environment
- Atualize `APP_URL` com sua URL do Render
- Atualize `CORS_ALLOWED_ORIGINS` com sua URL do Vercel
- Exemplo: `https://ranhentos-frontend.vercel.app`

### 2. Redeploy
- Faça redeploy em ambos os serviços após atualizar as URLs
- No Vercel: Settings → Functions → Redeploy
- No Render: Manual Deploy → Deploy latest commit

## 🧪 Teste

1. Acesse seu frontend no Vercel
2. Verifique se o dashboard carrega
3. Teste operações CRUD (criar, editar, excluir estudantes/cursos)
4. Monitore logs no Render em caso de erro

## 🛠️ Troubleshooting

### Problema: CORS Error
- Verifique se `CORS_ALLOWED_ORIGINS` no Render está correto
- Certifique-se que não há `/` no final da URL

### Problema: 500 Internal Server Error
- Verifique logs no Render Dashboard
- Confirme se `APP_KEY` está definida
- Verifique se migrações rodaram com sucesso

### Problema: Database Error
- O sistema está configurado para SQLite
- Banco é criado automaticamente no primeiro deploy
- Se necessário, use PostgreSQL do Render (adicional)

## 📊 Monitoramento

**Vercel:**
- Functions tab para logs do frontend
- Analytics para métricas de uso

**Render:**
- Logs tab para debug do backend
- Metrics para performance

## 🎉 Pronto!

Seu sistema de gestão escolar estará rodando em:
- **Frontend:** `https://SEU-PROJECT.vercel.app`
- **Backend API:** `https://SEU-SERVICE.onrender.com/api/v1`

### Funcionalidades disponíveis:
- ✅ Gestão de Estudantes
- ✅ Gestão de Cursos  
- ✅ Gestão de Inscrições
- ✅ Dashboard com métricas
- ✅ Relatórios e gráficos
- ✅ Interface responsiva
- ✅ API RESTful completa
