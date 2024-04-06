export default function Huddle01RoomPage({ params }: { params: { Huddle01Room: string }; }) {
    return (
        <>
            <h1 className="pt-6">Huddle01Room: {params.Huddle01Room}</h1>
        </>
    );
}