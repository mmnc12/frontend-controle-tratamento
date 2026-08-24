import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
      <div className="card max-w-md">
        <h1 className="text-2xl font-bold text-primary-600">
          🏥 Sistema de Controle de Tratamento
        </h1>
        <p className="text-secondary-600 mt-2">
          Tailwind CSS está funcionando!
        </p>
        <div className="mt-4 flex gap-2">
          <button className="btn-primary">Botão Primário</button>
          <button className="btn-secondary">Botão Secundário</button>
        </div>
      </div>
    </div>
  )
}

export default App