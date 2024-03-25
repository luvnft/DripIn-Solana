export default function SpecificCollectionPageHome({ params }: { params: { CollectionID: string }; }) {
    return (
        <>
            <div>
                {params.CollectionID}
            </div>
        </>
    );
}