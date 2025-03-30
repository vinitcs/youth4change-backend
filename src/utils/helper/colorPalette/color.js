const colors = [
  "0xFFCCCCCC",
  "0xFF00540B",
  "0xFF298B3D",
  "0xFF389D70",
  "0xFF88BF93",
  "0xFFC97C00",
];


export const getRandomColor = () =>{
  return colors[Math.floor(Math.random()*colors.length)];
};