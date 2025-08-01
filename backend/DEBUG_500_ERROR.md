# 🚨 Debug do Erro 500 no Backend

## Problema Identificado
```
GET /api/v1/reports/dashboard → 500 Internal Server Error
```

## 🔍 Onde Verificar no Backend

### 1. **Logs do Servidor**
```bash
# Se usando Laravel no backend, verificar:
tail -f storage/logs/laravel.log

# Ou verificar logs do servidor web:
tail -f /var/log/nginx/error.log  # Para Nginx
tail -f /var/log/apache2/error.log  # Para Apache
```

### 2. **Arquivo do Controller**
Verificar: `backend/app/Http/Controllers/ReportController.php`

**Possíveis problemas:**
- ❌ Método `dashboard()` não existe
- ❌ Erro de sintaxe no código
- ❌ Variável não definida
- ❌ Exceção não capturada

### 3. **Conexão com Banco de Dados**
```php
// Testar conexão no backend
DB::connection()->getPdo();
```

**Verificar:**
- ❌ Credenciais do banco no `.env`
- ❌ Banco de dados existe
- ❌ Tabelas necessárias existem
- ❌ Permissões de acesso

### 4. **Rotas da API**
Verificar: `backend/routes/api.php`

```php
// Deve ter algo como:
Route::get('/reports/dashboard', [ReportController::class, 'dashboard']);
```

## 🛠️ Como Debuggar

### Passo 1: Verificar se a rota existe
```bash
cd backend
php artisan route:list | grep reports
```

### Passo 2: Testar conexão com banco
```bash
cd backend
php artisan tinker
# No tinker:
DB::connection()->getPdo();
```

### Passo 3: Verificar logs em tempo real
```bash
# Terminal 1: Ver logs
tail -f backend/storage/logs/laravel.log

# Terminal 2: Fazer requisição
curl -X GET "https://ranhentos-idiomas-2.onrender.com/api/v1/reports/dashboard"
```

### Passo 4: Implementar log de debug
Adicionar no `ReportController.php`:

```php
public function dashboard()
{
    try {
        \Log::info('Dashboard endpoint accessed');
        
        // Seu código aqui...
        $data = [
            'stats' => [
                'total_students' => Student::count(),
                'total_courses' => Course::count(),
                // ... outros dados
            ]
        ];
        
        \Log::info('Dashboard data prepared successfully');
        return response()->json(['data' => $data]);
        
    } catch (\Exception $e) {
        \Log::error('Dashboard error: ' . $e->getMessage());
        \Log::error('Stack trace: ' . $e->getTraceAsString());
        
        return response()->json([
            'error' => 'Internal server error',
            'message' => $e->getMessage()
        ], 500);
    }
}
```

## 🎯 Soluções Rápidas

### Se o endpoint não existe:
```php
// No ReportController.php
public function dashboard()
{
    return response()->json([
        'data' => [
            'stats' => [
                'total_students' => 0,
                'total_courses' => 0,
                'total_enrollments' => 0,
                'total_revenue' => 0,
                'active_enrollments' => 0,
                'completed_enrollments' => 0,
                'cancelled_enrollments' => 0,
            ],
            'popular_courses' => [],
            'monthly_revenue' => [],
            'enrollment_status' => [],
        ]
    ]);
}
```

### Se há problema com banco:
```php
// Versão com try/catch
public function dashboard()
{
    try {
        $totalStudents = \DB::table('students')->count();
        $totalCourses = \DB::table('courses')->count();
        // ... resto dos dados
        
        return response()->json(['data' => $data]);
    } catch (\Exception $e) {
        \Log::error('Dashboard DB error: ' . $e->getMessage());
        
        // Retornar dados default em caso de erro
        return response()->json([
            'data' => [
                'stats' => [
                    'total_students' => 0,
                    'total_courses' => 0,
                    'total_enrollments' => 0,
                    'total_revenue' => 0,
                    'active_enrollments' => 0,
                    'completed_enrollments' => 0,
                    'cancelled_enrollments' => 0,
                ],
                'popular_courses' => [],
                'monthly_revenue' => [],
                'enrollment_status' => [],
            ]
        ]);
    }
}
```

## 📋 Checklist de Verificação

- [ ] Rota `/api/v1/reports/dashboard` existe em `routes/api.php`
- [ ] Controller `ReportController` existe
- [ ] Método `dashboard()` existe no controller
- [ ] Conexão com banco de dados está funcionando
- [ ] Tabelas necessárias existem no banco
- [ ] Não há erros de sintaxe no código
- [ ] Logs estão sendo gerados para debug

## 🚀 Teste Rápido

Para testar se o backend está funcionando:

```bash
# Teste simples
curl -X GET "https://ranhentos-idiomas-2.onrender.com/api/v1/health-check"

# Teste do endpoint específico
curl -X GET "https://ranhentos-idiomas-2.onrender.com/api/v1/reports/dashboard" -v
```

O erro 500 é sempre um problema no **código do backend**, não no frontend!
