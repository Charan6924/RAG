import { FileText } from "lucide-react";
import React from "react";

const page = () => {
  const pdfFiles = [
    {
      name: "pdf1.pdf",
      summary:
        "Study on how maternal plasma amino acid levels during pregnancy affect neonatal birthweight, length, and body composition over time.",
    },
    {
      name: "pdf2.pdf",
      summary:
        "Meta-analysis exploring how fecal microbiota transplantation (FMT) may enhance the effectiveness of immune checkpoint inhibitors in cancer treatment.",
    },
    {
      name: "pdf3.pdf",
      summary:
        "Comparison of nonavalent vs bivalent HPV vaccines in Dutch adolescents, assessing health outcomes and economic cost-effectiveness.",
    },
    {
      name: "pdf4.pdf",
      summary:
        "Explores the relationship between short-chain fatty acids, dietary fiber intake, and type 2 diabetes risk in a Spanish population cohort.",
    },
    {
      name: "pdf5.pdf",
      summary:
        "Randomized trial on how multifaceted health education improved influenza vaccination literacy and uptake in Chinese primary school students.",
    },
    {
      name: "pdf6.pdf",
      summary:
        "Finds lactate from exercise enhances cognitive function and synaptic protection in Alzheimer's models, acting as a key brain signaling molecule.",
    },
    {
      name: "pdf7.pdf",
      summary:
        "Investigates how aortic and carotid artery health are linked to white matter lesions and cognitive decline in older adults.",
    },
    {
      name: "pdf8.pdf",
      summary:
        "30-week follow-up of schoolchildren showing higher daily steps (especially weekdays) correlate with reduced body fat, BMI, and waist circumference.",
    },
    {
      name: "pdf9.pdf",
      summary:
        "Diagnostic study showing first-void urine HPV testing performs comparably to traditional cervical samples for detecting cervical precancer.",
    },
    {
      name: "pdf10.pdf",
      summary:
        "Proposes a rapid, layered diagnostic method using IDH and TERT promoter mutations for faster intraoperative classification of diffuse gliomas.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-10">
      <h1 className="text-3xl font-bold mb-2">Files</h1>
      <p className="text-zinc-400 mb-10 text-center max-w-3xl">
        Access and download the PDF documents passed into the RAG engine below.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-6xl">
        {pdfFiles.map((file) => (
          <li
            key={file.name}
            className="bg-zinc-900 rounded-xl p-4 shadow hover:shadow-lg transition h-full"
          >
            <a
              href={`/Files/${file.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-2 h-full"
            >
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-zinc-400" />
                <span className="font-medium text-sm">{file.name}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-snug">
                {file.summary}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default page;
