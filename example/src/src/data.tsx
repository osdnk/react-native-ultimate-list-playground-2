export type DataCell = {
  color: string;
  name: string;
  nested: {
    prof: string;
  };
};

const data: DataCell[] = [
  { color: 'red', name: 'Michał Osadnik', nested: { prof: 'X' } },
  { color: 'blue', name: 'Beata Kozidrak', nested: { prof: 'X' } },
  { color: 'green', name: 'Klucha Sierpowska', nested: { prof: 'V' } },
  { color: 'yellow', name: 'Adam Małysz', nested: { prof: 'X' } },
  { color: 'violet', name: 'Karol Wadowicz', nested: { prof: 'X' } },
  { color: 'purple', name: 'Jan Wojtyłowicz', nested: { prof: 'X' } },
];

// const data2: DataCell[] = [
//   { name: 'Michał Osadnik', nested: { prof: 'X' } },
//   { name: 'Beata Kozidrak', nested: { prof: 'X' } },
//   { name: 'Klucha Sierpowska', nested: { prof: 'V' } },
//   { name: 'Adam Małysz', nested: { prof: 'X' } },
//   { name: 'Karol Wadowicz', nested: { prof: 'X' } },
//   { name: 'Jan Wojtyłowicz', nested: { prof: 'X' } },
// ];

let moreData: DataCell[] = [];

for (let i = 0; i < 1000; i++) {
  moreData = data.concat(moreData);
}

// let moreData2: DataCell[] = [];
//
// for (let i = 0; i < 100; i++) {
//   moreData2 = data.concat(moreData);
// }

export { moreData as data };


type DataWrapper = {
  data: DataCell
  type: "data"
}
