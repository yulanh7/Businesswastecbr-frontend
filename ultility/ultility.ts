import CryptoJS from "crypto-js";

export const isValidEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const renderImg = (itemName: string) => {
  const options = [
    {
      id: 1,
      title: "Paper and cardboard",
      img: "/images/answers/quiz-paper.png",
    },
    {
      id: 2,
      title: "Mixed recycling",
      img: "/images/answers/quiz-mixed.png",
    },
    {
      id: 3,
      title: "Organics",
      img: "/images/answers/quiz-organic.png",
    },
    {
      id: 4,
      title: "Hazardous Waste",
      img: "/images/answers/quiz-waste.png",
    },
    {
      id: 5,
      title: "Landfill",
      img: "/images/answers/quiz-landfill.png",
    },
    // {
    //   id: 6,
    //   title: "6",
    //   img: "/images/answers/quiz-batteries.png",
    // },
    {
      id: 7,
      title: "Envelope",
      img: "/images/questions/Envelope.jpg",
    },
    {
      id: 8,
      title: "clean printed document",
      img: "/images/questions/Document.jpg",
    },
    {
      id: 9,
      title: "tissue box",
      img: "/images/questions/Tissues.jpg",
    },
    {
      id: 10,
      title: "flattened cardboard",
      img: "/images/questions/Box Flat.jpg",
    },
    {
      id: 11,
      title: "steel can",
      img: "/images/questions/Cans.jpg",
    },
    {
      id: 12,
      title: "glass bottle",
      img: "/images/questions/Glass.jpg",
    },
    {
      id: 13,
      title: "milk carton",
      img: "/images/questions/Milk Carton.jpg",
    },
    {
      id: 14,
      title: "berry punnet",
      img: "/images/questions/Punnet.jpg",
    },
    {
      id: 15,
      title: "food waste",
      img: "/images/questions/Sandwich_With_Bite.jpg",
    },
    {
      id: 16,
      title: "dead flowers",
      img: "/images/questions/Flowers.jpg",
    },
    {
      id: 17,
      title: "tea bags",
      img: "/images/questions/Tea Bags.jpg",
    },
    {
      id: 18,
      title: "paper towel",
      img: "/images/questions/Paper Towel.jpg",
    },
    {
      id: 19,
      title: "chip packet",
      img: "/images/questions/Chip Packet.jpg",
    },
    {
      id: 20,
      title: "battery",
      img: "/images/questions/battery.jpg",
    },
    {
      id: 21,
      title: "wire",
      img: "/images/questions/Wire.jpg",
    },
    {
      id: 22,
      title: "broken plate",
      img: "/images/questions/Broken Plate.jpg",
    },
    {
      id: 23,
      title: "Empty Jar",
      img: "/images/questions/Empty Jar.jpg",
    },
  ];

  const img = options.filter((option) => option.title == itemName);
  if (img && img.length) {
    return img[0].img;
  }
  return null;
};

export const hashPassword = (password: string) => {
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
};

export const getUserInfo = () => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? JSON.parse(userInfo) : null;
};

export const OPTIONS = [
  {
    bin: "Paper and cardboard",
    img: "/images/answers/quiz-paper.png",
  },
  {
    bin: "Mixed recycling",
    img: "/images/answers/quiz-mixed.png",
  },
  {
    bin: "Organics",
    img: "/images/answers/quiz-organic.png",
  },
  {
    bin: "Hazardous Waste",
    img: "/images/answers/quiz-waste.png",
  },
  {
    bin: "Landfill",
    img: "/images/answers/quiz-landfill.png",
  },
];

export type StreamType = {
  videoUrl: string;
  imageSrc: string;
  title: string;
  id: string;
  next?: string;
  prev?: string;
};

export const STREAMS: { [key: string]: StreamType } = {
  stream1: {
    videoUrl: "02_Paper",
    title: "Paper Recycling",
    id: "64e5600b4f6603d18855481d",
    next: "/training/stream2",
    imageSrc: "stream_cover1",
  },
  stream2: {
    videoUrl: "03_Mixed",
    title: "Mixed Recycling",
    id: "64e564734f6603d188554858",
    next: "/training/stream3",
    prev: "/training/stream1",
    imageSrc: "stream_cover2",
  },
  stream3: {
    videoUrl: "04_Organics",
    title: "Organics",
    id: "64e564d04f6603d188554862",
    next: "/training/stream4",
    prev: "/training/stream2",
    imageSrc: "stream_cover3",
  },
  stream4: {
    videoUrl: "05_Hazardous",
    title: "Hazardous Waste",
    id: "64e565a14f6603d188554867",
    next: "/training/stream5",
    prev: "/training/stream3",
    imageSrc: "stream_cover4",
  },
  stream5: {
    videoUrl: "06_Other",
    title: "Other Recycling Opportunities",
    id: "64e58022d26922cec47302d1",
    next: "/training/stream6",
    prev: "/training/stream4",
    imageSrc: "stream_cover5",
  },
  stream6: {
    videoUrl: "07_Landfill",
    title: "Landfill",
    id: "64e58043d26922cec47302d4",
    next: "/training",
    prev: "/training/stream5",
    imageSrc: "stream_cover6",
  },
};

export const scrollToSection = (sectioId: string) => {
  const section = document.getElementById(sectioId);
  const header = document.getElementById("header"); // Replace "header" with the actual selector for your header element
  if (section && header) {
    const headerHeight = header.clientHeight;
    const sectionRect = section.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollToPosition = sectionRect.top + scrollTop - headerHeight;
    window.scrollTo({
      top: scrollToPosition,
      behavior: "smooth",
    });
  }
};
