export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-20 w-20 border-8 border-indigo-600 border-t-transparent"></div>
      <p className="mt-8 text-3xl font-bold text-indigo-700">Cargando datos del orquestador...</p>
    </div>
  )
}