import { useEffect, useState } from "react";

export default function ProductoForm({
  initialProducto = null,
  categorias = [],
  onSubmit,
  onCancel,
  loading = false
}) {
  const editMode = !!initialProducto;
  const [form, setForm] = useState({
    codigo_producto: "",
    nombre: "",
    descripcion: "",
    precio_venta: "",
    precio_compra: "",
    unidad_medida: "",
    imagen_url: "",
    estado: true,
    stock_actual: 0,
    ano_garantia: 0,
    categoria: ""
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialProducto) {
      setForm({
        codigo_producto: initialProducto.codigo_producto || "",
        nombre: initialProducto.nombre || "",
        descripcion: initialProducto.descripcion || "",
        precio_venta: initialProducto.precio_venta || "",
        precio_compra: initialProducto.precio_compra || "",
        unidad_medida: initialProducto.unidad_medida || "",
        imagen_url: initialProducto.imagen_url || "",
        estado: typeof initialProducto.estado === "boolean" ? initialProducto.estado : true,
        stock_actual: initialProducto.stock_actual || 0,
        ano_garantia: initialProducto.ano_garantia || 0,
        categoria: initialProducto.categoria || ""
      });
    } else {
      setForm({
        codigo_producto: "",
        nombre: "",
        descripcion: "",
        precio_venta: "",
        precio_compra: "",
        unidad_medida: "",
        imagen_url: "",
        estado: true,
        stock_actual: 0,
        ano_garantia: 0,
        categoria: ""
      });
    }
  }, [initialProducto]);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      codigo_producto: true,
      nombre: true,
      precio_venta: true,
      precio_compra: true,
      categoria: true
    });
    if (!form.codigo_producto || !form.nombre || !form.precio_venta || !form.precio_compra || !form.categoria) return;
    const formData = new FormData();
    formData.append("codigo_producto", String(form.codigo_producto).trim());
    formData.append("nombre", String(form.nombre).trim());
    formData.append("descripcion", String(form.descripcion).trim());
    formData.append("precio_venta", String(form.precio_venta));
    formData.append("precio_compra", String(form.precio_compra));
    formData.append("unidad_medida", String(form.unidad_medida).trim());
    formData.append("estado", form.estado ? "true" : "false");
    formData.append("stock_actual", String(form.stock_actual));
    formData.append("ano_garantia", String(form.ano_garantia));
    formData.append("categoria", String(form.categoria));
    if (imagenFile) {
      formData.append("imagen", imagenFile);
    }
    if (initialProducto?.id) {
      formData.append("id", initialProducto.id);
    }
    onSubmit(formData);
  }

  const invalid = {
    codigo_producto: touched.codigo_producto && !form.codigo_producto,
    nombre: touched.nombre && !form.nombre,
    precio_venta: touched.precio_venta && !form.precio_venta,
    precio_compra: touched.precio_compra && !form.precio_compra,
    categoria: touched.categoria && !form.categoria
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Producto" : "Nuevo Producto"}
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
              {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Crear Producto"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Código Producto *"
            error={invalid.codigo_producto && "Requerido"}
            children={
              <input
                value={form.codigo_producto}
                onChange={e => setField("codigo_producto", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, codigo_producto: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.codigo_producto ? "input-error" : ""}`}
                placeholder="Ej: PROD-001"
              />
            }
          />
          <Field
            label="Nombre *"
            error={invalid.nombre && "Requerido"}
            children={
              <input
                value={form.nombre}
                onChange={e => setField("nombre", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, nombre: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.nombre ? "input-error" : ""}`}
                placeholder="Nombre del producto"
              />
            }
          />
          <Field
            label="Descripción"
            children={
              <textarea
                value={form.descripcion}
                onChange={e => setField("descripcion", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="Descripción"
              />
            }
          />
          <Field
            label="Precio Venta *"
            error={invalid.precio_venta && "Requerido"}
            children={
              <input
                type="number"
                value={form.precio_venta}
                onChange={e => setField("precio_venta", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, precio_venta: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.precio_venta ? "input-error" : ""}`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            }
          />
          <Field
            label="Precio Compra *"
            error={invalid.precio_compra && "Requerido"}
            children={
              <input
                type="number"
                value={form.precio_compra}
                onChange={e => setField("precio_compra", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, precio_compra: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.precio_compra ? "input-error" : ""}`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            }
          />
          <Field
            label="Unidad de Medida"
            children={
              <input
                value={form.unidad_medida}
                onChange={e => setField("unidad_medida", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="Ej: unidad, kg, caja"
              />
            }
          />
          <Field
            label="Imagen del Producto"
            children={
              <input
                type="file"
                accept="image/*"
                onChange={e => setImagenFile(e.target.files[0])}
                disabled={loading}
                className="input-base"
              />
            }
          />
          <Field
            label="Stock Actual"
            children={
              <input
                type="number"
                value={form.stock_actual}
                onChange={e => setField("stock_actual", e.target.value)}
                disabled={loading}
                className="input-base"
                min="0"
              />
            }
          />
          <Field
            label="Año Garantía"
            children={
              <input
                type="number"
                value={form.ano_garantia}
                onChange={e => setField("ano_garantia", e.target.value)}
                disabled={loading}
                className="input-base"
                min="0"
              />
            }
          />
          <Field
            label="Categoría *"
            error={invalid.categoria && "Requerido"}
            children={
              <select
                value={form.categoria}
                onChange={e => setField("categoria", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, categoria: true }))}
                disabled={loading || editMode}
                className={`input-base ${invalid.categoria ? "input-error" : ""}`}
                required
              >
                <option value="">Seleccione una categoría...</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            }
          />
          <Field
            label="Estado"
            children={
              <div className="flex items-center gap-2 h-[46px] px-4 rounded-2xl border border-gray-300 bg-white">
                <input
                  type="checkbox"
                  checked={form.estado}
                  onChange={e => setField("estado", e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  {form.estado ? "Activo" : "Inactivo"}
                </span>
              </div>
            }
          />
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <strong>Nota:</strong> Los campos marcados con * son obligatorios.
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
