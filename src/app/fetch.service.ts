interface FetchPayloadProps {
    type: 'email'|'mobile'
    value: string
}
export async function FetchService({type, value}: FetchPayloadProps) {

    const baseUrl = 'https://bucketlisterswaitlist.vercel.app/api'
    const fetchData = await fetch(baseUrl, {
        method: 'POST',
        body: JSON.stringify({type, value})
    });

    const result = await fetchData.json();
    return result;
}