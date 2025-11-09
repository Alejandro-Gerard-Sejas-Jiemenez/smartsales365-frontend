import { useEffect, useState } from "react";

export default function ClienteForm({
  initialCliente = null,
  usuarios = [],
  onSubmit,
  onCancel,
  loading = false
}) {
  const editMode = !!initialCliente;
  const [form, setForm] = useState({
    ciudad: "",
    codigo_postal: "",
    preferencia_compra: "",
    total_compras: 0,
    usuario: ""
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialCliente) {
      setForm({
        ciudad: initialCliente.ciudad || "",
        codigo_postal: initialCliente.codigo_postal || "",
        preferencia_compra: initialCliente.preferencia_compra || "",
        total_compras: initialCliente.total_compras || 0,
        usuario: initialCliente.usuario || ""
      });
    } else {
      setForm({
        ciudad: "",
        codigo_postal: "",
        preferencia_compra: "",
        total_compras: 0,
        usuario: ""
      });
    }
  }, [initialCliente]);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      ciudad: true,
      codigo_postal: true,
      usuario: true
    });
    if (!form.ciudad || !form.codigo_postal || !form.usuario) return;
    const payload = {
      id: initialCliente?.id,
      ciudad: String(form.ciudad).trim(),
      codigo_postal: String(form.codigo_postal).trim(),
      preferencia_compra: String(form.preferencia_compra).trim(),
      total_compras: Number(form.total_compras) || 0,
      usuario: form.usuario
    };
    onSubmit(payload);
  }

  const invalid = {
    ciudad: touched.ciudad && !form.ciudad,
    codigo_postal: touched.codigo_postal && !form.codigo_postal,
    usuario: touched.usuario && !form.usuario
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Cliente" : "Nuevo Cliente"}
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow disabled:opacity-60"
            >
              {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Crear Cliente"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Ciudad *"
            error={invalid.ciudad && "Requerido"}
            children={
              <input
                value={form.ciudad}
                onChange={e => setField("ciudad", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, ciudad: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.ciudad ? "input-error" : ""}`}
                placeholder="Ciudad"
              />
            }
          />
          <Field
            label="Código Postal *"
            error={invalid.codigo_postal && "Requerido"}
            children={
              <input
                value={form.codigo_postal}
                onChange={e => setField("codigo_postal", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, codigo_postal: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.codigo_postal ? "input-error" : ""}`}
                placeholder="Ej: 12345"
              />
            }
          />
          <Field
            label="Preferencia de Compra"
            children={
              <input
                value={form.preferencia_compra}
                onChange={e => setField("preferencia_compra", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="Ej: Electrónica, Ropa, etc."
              />
            }
          />
          <Field
            label="Total Compras (solo lectura)"
            children={
              <input
                value={form.total_compras}
                disabled
                className="input-base bg-gray-100"
                placeholder="0"
                type="number"
              />
            }
          />
          <Field
            label="Usuario *"
            error={invalid.usuario && "Requerido"}
            children={
              <select
                value={form.usuario}
                onChange={e => setField("usuario", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, usuario: true }))}
                disabled={loading || editMode}
                className={`input-base ${invalid.usuario ? "input-error" : ""}`}
                required
              >
                <option value="">Seleccione un usuario...</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.correo}</option>
                ))}
              </select>
            }
          />
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <strong>Nota:</strong> Se requiere rellenar todos los campos obligatorios.
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-wide text-gray-600">
        {label}
      </label>
      {children}
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}
