export type DataCell = {
  name: string;
  nested: {
    prof: string;
  };
};

const data: DataCell[] = [
  { name: 'Michał Osadnik', nested: { prof: 'X' } },
  { name: 'Beata Kozidrak', nested: { prof: 'X' } },
  { name: 'Klucha Sierpowska', nested: { prof: 'V' } },
  { name: 'Adam Małysz', nested: { prof: 'X' } },
  { name: 'Karol Wadowicz', nested: { prof: 'X' } },
  { name: 'Jan Wojtyłowicz', nested: { prof: 'X' } },
];

let moreData: DataCell[] = [];

for (let i = 0; i < 100; i++) {
  moreData = data.concat(moreData);
}

export { moreData as data };


type DataWrapper = {
  data: DataCell
  type: "data"
}
