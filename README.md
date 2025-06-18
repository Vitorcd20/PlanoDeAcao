# PlanoDeAcao
Projeto Plano de Ação  - Java SpringBoot e Vite React - Database: MySql Workbench

# Plano-de-Ação
Plano de Acão ( Java springboot  + Vite React )

```
backend/
├── src/
│   └── main/
│       └── java/
│           └── com/vitorcd/planodeacao/
│               ├── controllers/            # Camada de controle (REST)
│               │   ├── AcaoController.java
│               │   └── PlanoAcaoController.java
│               ├── dto/                    # Objetos Data Transfer (DTOs)
│               │   ├── AcaoDTO.java
│               │   └── PlanoAcaoDTO.java
│               ├── entity/                 # Entidades JPA (mapeamento de banco)
│               │   ├── Acao.java
│               │   └── PlanoAcao.java
│               ├── enums/                  # Enumerações do domínio
│               │   ├── StatusAcao.java
│               │   └── StatusPlano.java
│               ├── exception/              # Tratamento de exceções
│               │   ├── ErrorResponse.java
│               │   ├── GlobalExceptionHandler.java
│               │   └── ResourceNotFoundException.java
│               ├── repositories/           # Interfaces de repositórios (JPA)
│               │   ├── AcaoRepository.java
│               │   └── PlanoAcaoRepository.java
│               ├── service/                # Regras de negócio
│               │   ├── AcaoService.java
│               │   └── PlanoAcaoService.java
│               └── PlanoDeAcaoApplication.java  # Classe principal Spring Boot
├── test/
│   └── java/
│       └── com/vitorcd/planodeacao/controllers/
│           ├── AcaoControllerTest.java
│           └── PlanoAcaoControllerTest.java
├── pom.xml                               # Gerenciador de dependências Maven
└── README.md                             # Documentação do projeto
```

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                          # Componentes básicos reutilizáveis
│   │   ├── form-modal/                  # Formulários específicos
│   │   │   ├── plans-component/
│   │   │   │   ├── PlanCard/
│   │   │   │   ├── PlansList/
│   │   │   │   └── PlansContext/
│   │   │   └── dashboard/
│   ├── pages/                          # Páginas da aplicação
│   ├── hooks/                          # Hooks customizados
│   ├── services/                       # Serviços para API
│   ├── utils/                          # Funções utilitárias
│   ├── types/                          # Definições de tipos TypeScript
│   ├── constants/                      # Constantes da aplicação
│   └── styles/                        # Estilos globais
```


3. Como clonar projeto
git clone https://github.com/Vitorcd20/PlanoDeAcao.git
cd Plano-de-Acao


4- Configurar e executar o backend
Pré-requisitos:

Java JDK 21+ 

Maven(3.8.1)

Banco de dados configurado (MySQL workbench)


5- Configurar e executar o frontend
Pré-requisitos:

Node.js 20.19.0

npm ou yarn

Comandos para rodar:

cd vite-project\vite-project
npm install
npm run dev
