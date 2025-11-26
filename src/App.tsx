import { useState, useEffect } from 'react'
import axios from 'axios'
import Loader from './components/atoms/Loader'
import Card from './components/atoms/Card'

const API_BASE = "https://contabilidad-orquestador-production.up.railway.app/api/Contabilidad"

type Tab = 'resumen' | 'clientes' | 'facturas' | 'pagos'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('resumen')
  const [reporte, setReporte] = useState<any>(null)
  const [clientes, setClientes] = useState<any[]>([])
  const [facturas, setFacturas] = useState<any[]>([])
  const [pagos, setPagos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [rep, cli, fac, pag] = await Promise.all([
          axios.get(`${API_BASE}/reporte-morosidad`),
          axios.get(`${API_BASE}/clientes`),
          axios.get(`${API_BASE}/facturas`),
          axios.get(`${API_BASE}/pagos`)
        ])
        setReporte(rep.data)
        setClientes(cli.data)
        setFacturas(fac.data)
        setPagos(pag.data)
      } catch (err) {
        setError('Error al cargar los datos del orquestador')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Loader />
  if (error) return <div className="text-center text-4xl text-red-600 p-20">{error}</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <h1 className="text-5xl md:text-6xl font-bold text-center text-indigo-800 mb-12">
          Orquestador Contabilidad - Dashboard
        </h1>

        {/* Pestañas */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {(['resumen', 'clientes', 'facturas', 'pagos'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-2xl'
                  : 'bg-white text-indigo-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {tab === 'resumen' && 'Resumen Morosidad'}
              {tab === 'clientes' && `Clientes (${clientes.length})`}
              {tab === 'facturas' && `Facturas (${facturas.length})`}
              {tab === 'pagos' && `Pagos (${pagos.length})`}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="space-y-12">
          {activeTab === 'resumen' && reporte && (
            <Card>
              <h2 className="text-4xl font-bold text-center mb-10 text-indigo-700">
                Reporte General de Morosidad
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-green-100 p-8 rounded-3xl text-center shadow-xl">
                  <p className="text-6xl font-bold text-green-700">{reporte.resumen.alDia || 0}</p>
                  <p className="text-2xl mt-2">Al día</p>
                </div>
                <div className="bg-yellow-100 p-8 rounded-3xl text-center shadow-xl">
                  <p className="text-6xl font-bold text-yellow-700">{reporte.resumen.enObservacion || 0}</p>
                  <p className="text-2xl mt-2">En Observación</p>
                </div>
                <div className="bg-red-100 p-8 rounded-3xl text-center shadow-xl">
                  <p className="text-6xl font-bold text-red-700">{reporte.resumen.morosos || 0}</p>
                  <p className="text-2xl mt-2">Morosos</p>
                </div>
                <div className="bg-purple-100 p-8 rounded-3xl text-center shadow-xl">
                  <p className="text-5xl font-bold text-purple-700">
                    Bs. {Number(reporte.totalDeudaGeneral || 0).toLocaleString()}
                  </p>
                  <p className="text-2xl mt-2">Deuda Total</p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'clientes' && (
            <Card>
              <h2 className="text-4xl font-bold mb-8 text-indigo-700">Lista de Clientes</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-indigo-600 text-white text-left">
                      <th className="p-6 rounded-tl-2xl">CI</th>
                      <th className="p-6">Nombre Completo</th>
                      <th className="p-6 rounded-tr-2xl">Categoría</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((c, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="p-6 font-mono text-lg">{c.ci}</td>
                        <td className="p-6 font-medium">{c.nombre}</td>
                        <td className="p-6 text-center">{c.categoria}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'facturas' && (
            <Card>
              <h2 className="text-4xl font-bold mb-8 text-indigo-700">Facturas Emitidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facturas.map(f => (
                  <div key={f.codigo} className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border-2 border-indigo-300 shadow-lg">
                    <p className="text-3xl font-bold text-indigo-700"># {f.codigo}</p>
                    <p className="mt-3"><strong>CI:</strong> {f.clienteCi}</p>
                    <p className="text-2xl font-bold text-indigo-900 mt-2">Bs. {f.montoTotal}</p>
                    <p className="text-sm text-gray-600 mt-3">{new Date(f.fecha).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'pagos' && (
            <Card>
              <h2 className="text-4xl font-bold mb-8 text-green-700">Pagos Registrados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pagos.map(p => (
                  <div key={p.codigo} className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-2 border-green-300 shadow-lg">
                    <p className="text-2xl font-bold text-green-700">Factura #{p.facturaCodigo}</p>
                    <p className="text-3xl font-bold text-green-900 mt-3">Bs. {p.montoPagado}</p>
                    <p className="text-sm text-gray-600 mt-3">{new Date(p.fechaPago).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default App