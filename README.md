# Complete Components (For the Supabase Open Source Hackathon 2024)
Complete Components is an open-source project that leverages AI to help developers quickly build and integrate HTML components and code with Supabase and Tailwind CSS.

## Features
- **AI-assisted Component Generation**: Utilize AI to generate HTML components tailored to your project's needs, saving you time and effort.
- - **Supabase Integration**: Seamlessly integrate your components with Supabase, a modern and powerful backend-as-a-service solution. Uses RAG to improve the AI's coding understanding and implementation of supabase-js and reduce hallucinations
- - **Tailwind CSS Support**: Leverage the utility-first CSS framework, Tailwind CSS, to rapidly style your components with a consistent design system.

## Getting Started
### Prerequisites
- Node - I use v20.10.0
### Installation
1. Clone the repository:
```bash
git https://github.com/gSUz92nc/Complete-Components.git
```

2. Navigate to the project directory:
```bash
cd complete-components
```

3. Install the dependencies:
```bash
npm install
```

4. Setup env.local:
Create a file called `.env.local` and include these with your own values
```bash
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
PUBLIC_URL=http://localhost:5173
SUPABASE_SERVICE_KEY=
BRIGHT_DATA_PASS=
BRIGHT_DATA_USER=
```

### Usage

1. Start the development server:
 ```bash
 npm run dev
 ```
2. Open your browser and visit `http://localhost:5173`.

## License
Complete Components is released under the [MIT License](https://github.com/gSUz92nc/Complete-Components/tree/main?tab=MIT-1-ov-file#readme).

## Contributing
I'm useless at github so if you would like to contribute (warning everything is a mess since I started late) I'll try my best to incorparate your changes.

## Acknowledgements
I couldn't have done this without the amazing tooling provided by Supabase, TailwindCSS, Anthropic, SvelteKit and more.
