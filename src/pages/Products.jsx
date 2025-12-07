import DataManager from '../components/dashboard/DataManager';

export default function Products() {
    return (
        <DataManager
            collection="products"
            title="Productos"
            singularTitle="Producto"
            basePath="/products"
        />
    );
}
