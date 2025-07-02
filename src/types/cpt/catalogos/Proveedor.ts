/**
 * Representa la estructura completa de un proveedor.
 */
export interface Proveedor {
  proveedor: number;
  nombre: string;
  rfc: string;
  direccion: string;
  ciudad: string;
  cp: string;
  telefonos: string;
  fax: string;
  correoE: string;
  contacto: string;
  estatus: string;
}

/**
 * Define la estructura de los datos del formulario.
 * Hacemos opcionales los campos que no son estrictamente necesarios para crear o editar.
 */
export interface ProveedorFormData {
  proveedor: number;
  nombre: string;
  rfc?: string;
  direccion?: string;
  ciudad?: string;
  cp?: string;
  telefonos?: string;
  fax?: string;
  correoE?: string;
  contacto?: string;
  estatus?: string;
}