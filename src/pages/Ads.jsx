import DataManager from '../components/dashboard/DataManager';

export default function Ads() {
    return (
        <DataManager
            collection="ads"
            title="Anuncios"
            singularTitle="Anuncio"
            basePath="/ads"
        />
    );
}
