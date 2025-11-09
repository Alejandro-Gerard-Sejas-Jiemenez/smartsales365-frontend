import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import ClienteForm from "../../../components/dashboard/ClienteForm.jsx";
import { api } from "../../../services/apiClient.js";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";

export default function ClientesPage() {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteCliente, setDeleteCliente] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    Promise.all([
      api.get("/api/clientes/"),
      api.get("/api/acceso_seguridad/usuarios/")
    ])
      .then(([c, u]) => {
        setClientes(Array.isArray(c) ? c : []);
        setUsuarios(Array.isArray(u) ? u : []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { cargar(); }, []);

  // Crear
  function onCreate() {
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Editar
  function onEdit(row) {
    const cliente = clientes.find(c => c.id === row.id);
    if (!cliente) return;
    setEditing(cliente);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Guardar (crear/editar)
  function saveCliente(data) {
    setLoading(true);
    const isEdit = !!data.id;
    const url = isEdit ? `/api/catalogo/clientes/${data.id}/` : "/api/catalogo/clientes/";
    const method = isEdit ? api.put : api.post;
    method(url, data)
      .then(() => {
        setShowForm(false);
        setEditing(null);
        cargar();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  // Eliminar
  function onDelete(row) {
    const cliente = clientes.find(c => c.id === row.id);
    if (!cliente) return;
    setDeleteCliente(cliente);
  }

  function confirmDelete() {
    if (!deleteCliente) return;
    setLoading(true);
    api.del(`/api/catalogo/clientes/${deleteCliente.id}/`)
      .then(() => {
        setDeleteCliente(null);
        cargar();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  const rows = clientes.map(c => {
    const usuario = usuarios.find(u => u.id === c.usuario);
    return {
      id: c.id,
      ciudad: c.ciudad,
      codigo_postal: c.codigo_postal,
      preferencia_compra: c.preferencia_compra,
      total_compras: c.total_compras,
      usuario: usuario ? usuario.correo : c.usuario
    };
  });

  return (
    <div className="space-y-8">
      {showForm && (
        <ClienteForm
          initialCliente={editing}
          usuarios={usuarios}
          onSubmit={saveCliente}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          loading={loading}
        />
      )}

      {error && (
        <div className="px-4 py-2 rounded border border-red-200 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <SmartTable
        titulo="Clientes"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "70px", enableSort: true },
          { key: "usuario", label: "Correo Usuario", enableSort: true },
          { key: "ciudad", label: "Ciudad", enableSort: true },
          { key: "codigo_postal", label: "Código Postal" },
          { key: "preferencia_compra", label: "Preferencia Compra" },
          { key: "total_compras", label: "Total Compras", width: "120px" }
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteCliente}
        title="Eliminar Cliente"
        message={`¿Seguro que deseas eliminar el cliente de usuario "${deleteCliente?.usuario}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCliente(null)}
      />
    </div>
  );
}
