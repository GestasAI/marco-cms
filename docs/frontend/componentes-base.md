# 🧩 Componentes Base

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Componentes Reutilizables

### Button
```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

---

### Input
```tsx
interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={required}
      />
    </div>
  );
};
```

---

### Modal
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
```

---

### Table
```tsx
interface Column {
  key: string;
  label: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

const Table: React.FC<TableProps> = ({ columns, data, onRowClick }) => {
  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map(col => (
            <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr 
            key={idx} 
            onClick={() => onRowClick?.(row)}
            className="hover:bg-gray-50 cursor-pointer"
          >
            {columns.map(col => (
              <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

### Spinner
```tsx
const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
};
```

---

### Alert
```tsx
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300'
  };
  
  return (
    <div className={`p-4 border rounded-md ${colors[type]} flex justify-between items-center`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 font-bold">✕</button>
      )}
    </div>
  );
};
```

---

**Última actualización**: 22 de Noviembre de 2025
