interface Person {
    id: number;
    name: string;
    gender: string;
    birthdate: string;
    deathdate: string | null;
    birthplace: string;
    deathPlace: string | null;
    email: string;
    phone: string;
    address: string;
    current_address: string;
    image: string;
    relationshipsFrom: Relationship[];
    relationshipsTo: Relationship[];
}

interface Relationship {
    id: number;
    type_id: number;
    from_person_id: number;
    to_person_id: number;
    toPerson: Person;
    fromPerson?: Person;
    type: RelationshipType;
}

interface RelationshipType {
    id: number;
    type: string;
}

interface TransformedData {
    child: string;
    parent: string;
    spouse: string;
}

function transformData(data: Person[]): TransformedData[] {
    const transformed: TransformedData[] = [];

    data.forEach(person => {
        person.relationshipsFrom.forEach(relationship => {
            const childName = relationship.toPerson.name;
            const parentName = person.name;
            transformed.push({
                child: childName,
                parent: parentName,
                spouse: '' // Assuming no spouse information provided
            });
        });
    });

    return transformed;
}