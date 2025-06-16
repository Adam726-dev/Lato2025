import React from "react";
import { useParams, Link } from "react-router-dom";
import Barcode from 'react-barcode';

function generateRandomNumber() {
  let num = "";
  for (let i = 0; i < 10; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}



const VoucherPage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const number = React.useMemo(() => generateRandomNumber(), []);
  const sectionNames: Record<string, string> = {
    silownia: "Karnet",
    dieta: "Dieta",
    imprezy: "Bilet",
    wakacje: "Wakacje"
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-mint-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md justify-center">
        <h1 className="text-2xl font-bold text-center mb-6">Zeskanuj kod</h1>
        <div className="mb-4 text-center justify-center">
          <Barcode className="mx-auto" value={number} />
        </div>
        <div className="mb-2 text-lg font-semibold text-center">
          {sectionNames[sectionId || ""] || "Voucher"}
        </div>
        <div className="mb-4 text-center">
          <span className="font-medium text-gray-700">Nr:</span>{" "}
          <span className="font-mono text-lg tracking-widest">{number}</span>
        </div>
        <div className="text-center">
          <Link to="/podsumowanie">
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
              Powrót do planu
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VoucherPage;