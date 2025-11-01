import { Clock, Copy, FileClock, FileText, Laptop, MessageSquare, MessagesSquare, Pencil, PlusCircle, Text, Trash2, Type } from "lucide-react";
import { useState } from "react";
import { SiYoutube } from "react-icons/si";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { Modal } from "../../../components/ui/modal";
import TabBar from "../../../hooks/TabBar";
import AccordionItem from "../../../hooks/AccordionItem";

const DetalheCurso: React.FC = () => {
  const navigate = useNavigate();
//   const { currentRole, modEditable } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openModal1 = () => setIsModalOpen1(true);
  const closeModal1 = () => setIsModalOpen1(false);

  function getIcon(tipo: string): React.ReactNode {
    switch (tipo) {
      case "ARTIGO":
        return <Text className="text-blue-600" size={28} />;
      case "CERTIFICADO":
        return <Laptop className="text-yellow-600" size={28} />;
      case "FORUM":
        return <MessageSquare className="text-purple-600" size={28} />;
      case "PAGINA":
        return <FileText className="text-teal-600" size={28} />;
      case "QUIZ":
        return <FileClock className="text-pink-600" size={28} />;
      case "ROTULO":
        return <Type className="text-gray-600" size={28} />;
      case "TAREFA":
        return <Clock className="text-red-600" size={28} />;
      case "TEXTO":
        return <FileText className="text-green-600" size={28} />;
      case "VIDEO":
        return <SiYoutube className="text-red-600" size={28} />;
      default:
        return <Laptop className="text-slate-500" size={28} />;
    }
  }

  function showAtividades() {
    return Array.from({ length: 3 }).map((_, idx) => (
      <div key={idx} className="flex flex-col gap-5">
        {/* <InfoCard
          icon={getIcon("QUIZ")}
          title={`Atividade ${idx + 1}`}
          link="/dashboard/meus-cursos/atividade/1"
          description="01/01/2024"
          actions={currentRole === "ESTUDANTE"
            ? [{
              label: "Visualizar",
              onClick: () => navigate(`/dashboard/meus-cursos/atividade/${idx + 1}`),
            }]
            : [
              {
                label: "Visualizar",
                onClick: () => navigate(`/dashboard/meus-cursos/atividade/${idx + 1}`),
              },
              {
                label: "Editar",
                onClick: () => navigate(`/dashboard/meus-cursos/atividade/editar/${idx + 1}`),
              },
              {
                label: "Remover",
                onClick: () => navigate(`/dashboard/meus-cursos/atividade/remover/${idx + 1}`),
              },
            ]
          }
        /> */}
      </div>
    ));
  }

  function ShowModules({ index }: { index: number }) {
    return (
      <AccordionItem
        key={index}
        titulo={
          <div className="flex flex-col w-full">
            <div className="font-semibold text-gray-800 font-x">Módulo {index + 1}</div>
            <div className="flex flex-row justify-between">
              <div className="text-sm text-gray-600">01/01/2024</div>
              <div className="text-sm text-gray-600">25%</div>
            </div>
          </div>
        }
        actions={[
          {
            label: "Editar",
            icon: <Pencil size={16} />,
            onClick: openModal,
          },
          {
            label: "Duplicar",
            icon: <Copy size={16} />,
            onClick: () => console.log("Duplicar módulo"),
          },
          {
            label: "Eliminar",
            icon: <Trash2 size={16} className="text-red-600" />,
            onClick: () => console.log("Eliminar módulo"),
          },
        ]}
      >
        {showAtividades()}
          <button
            onClick={openModal1}
            className="w-full flex items-center justify-center mt-5 border border-blue-600 text-blue-600 bg-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Adicionar
          </button>
      </AccordionItem>
    );
  }

  // TAB BAR
  const listabs = [
    {
      label: "Curso",
      content: (
        <div className="relative">
          {/* Pontuação */}
          <div className="absolute top-0 right-6 text-3x2 font-medium text-black w-26 h-26 border-4 border-green-500 rounded-full flex items-center justify-center">
            75/100
          </div>
          {/* Título */}
          <div>
            <h1 className="text-3xl font-semibold">Nome do Curso</h1>
            <h5 className="text-gray-600">Categoria do Curso: <span className="font-semibold bg-blue">Programação</span></h5>
          </div>

          <div className="space-y-3 py-15">
            {Array.from({ length: 3 }).map((_, i) => (
              <ShowModules key={i} index={i} />
            ))}
          </div>

            <button 
              onClick={openModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Adicionar Módulo
            </button>
        </div>
      )
    },
    {
      label: "Notas",
      content: (
        <div>
          <h1 className="text-3xl font-semibold mb-6">Minhas notas</h1>
          <div className="space-y-3">
            <div />
            {/* <ActNota /> */}
          </div>
        </div>
      )
    },
    {
      label: "Participantes",
      content: (
        <>
          {/* {currentRole === "PROFESSOR" || currentRole === "INSTITUICAO" || currentRole === "ADMIN" ? ( */}
            <div>
              <h1 className="text-3xl font-semibold mb-6">Participantes</h1>
              <div className="space-y-3">
                <div />
                {/* <ActParticipante /> */}
              </div>
            </div>
          {/* ) : (
            <div className="text-red-500 text-center h-100 flex justify-center items-center">
              Não tens permissão para ver esta informação
            </div>
          )} */}
        </>
      )
    },
    {
      label: "Relatorios",
      content: (
        <>
          {/* {currentRole === "INSTITUICAO" || currentRole === "ADMIN" ? ( */}
            <div>
              <h1 className="text-3xl font-semibold mb-6">Relatórios</h1>
              <div className="space-y-3">
                <div />
                {/* <ActParticipante /> */}
              </div>
            </div>
          {/* ) : (
            <div className="text-red-500 text-center h-100 flex justify-center items-center">
              Não tens permissão para ver esta informação
            </div>
          )} */}
        </>
      )
    },
    {
      label: "Configurações",
      content: (
        <>
          {/* {currentRole === "INSTITUICAO" || currentRole === "ADMIN" ? ( */}
            <div>
              <div className="space-y-3">
                <div className="w-full bg-white">
                  <h2 className="text-lg font-semibold pl-4">Nome do Curso</h2>
                  <h3 className="text-sm font-semibold pl-4">Editar Informações do Curso</h3>
                  <div />
                  {/* <AddCurso cursop={new Curso()} isSaved={() => {}} key={1423423} /> */}
                </div>
              </div>
            </div>
          {/* ) : (
            <div className="text-red-500 text-center h-100 flex justify-center items-center">
              Não tens permissão para ver esta informação
            </div>
          )} */}
        </>
      )
    },
    {
      label: "Finanças",
      content: (
        <>
          {/* {currentRole === "INSTITUICAO" || currentRole === "ADMIN" ? ( */}
            <div>
              <h1 className="text-3xl font-semibold mb-6">Finanças</h1>
              <div className="space-y-3">
                {/* <ActParticipante /> */}
                <div />
              </div>
            </div>
          {/* ) : (
            <div className="text-red-500 text-center h-100 flex justify-center items-center">
              Não tens permissão para ver esta informação
            </div>
          )} */}
        </>
      )
    }
  ];

  const filteredTabs = listabs.filter(tb => {
    // if (currentRole === "ESTUDANTE") {
    //   return ["Curso", "Notas"].includes(tb.label);
    // } else if (currentRole === "PROFESSOR") {
    //   return ["Curso", "Notas", "Participantes"].includes(tb.label);
    // }
    return true;
  });

  return (
    <div className="bg-white p-4">
      <PageMeta
        title="Angola Educa Mais"
        description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Curso de Exemplo" />
      
      {/* Tabs */}
      <TabBar
        tabs={filteredTabs}
        layout="top"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Detalhes do Curso"
        showCloseButton={true}
        width="550px"
      >
        {/* <AddModulo onSuccess={closeModal} modulop={{}} curso={new Curso()} /> */}
        <div />
      </Modal>

      <Modal
        isOpen={isModalOpen1}
        onClose={closeModal1}
        title="Adicionar Actividade ou Recurso"
        showCloseButton={true}
        width="500px"
      >
        <div className="grid grid-cols-3 gap-4">
          {/* Primeira linha */}
          <div 
            onClick={() => navigate("/dashboard/meus-cursos/atividade/criar/1?tipo=VIDEO")}
            className="flex flex-col items-center p-2 border rounded-lg shadow hover:bg-gray-100 cursor-pointer"
          >
            <SiYoutube className="text-red-600" size={28} />
            <span className="text-xs mt-1">Vídeo Aula</span>
          </div>
          <div 
            onClick={() => navigate("/dashboard/meus-cursos/atividade/criar/1?tipo=QUIZ")}
            className="flex flex-col items-center p-2 border rounded-lg shadow hover:bg-gray-100 cursor-pointer"
          >
            <FileClock className="text-blue-600" size={28} />
            <span className="text-xs mt-1">Quiz</span>
          </div>
          <div 
            onClick={() => navigate("/dashboard/meus-cursos/atividade/criar/1?tipo=PAGINA")}
            className="flex flex-col items-center p-2 border rounded-lg shadow hover:bg-gray-100 cursor-pointer"
          >
            <FileText className="text-green-600" size={28} />
            <span className="text-xs mt-1">Página</span>
          </div>

          {/* Segunda linha */}
          <div 
            onClick={() => navigate("/dashboard/meus-cursos/atividade/criar/1?tipo=INTERATIVA")}
            className="flex flex-col items-center p-2 border rounded-lg shadow hover:bg-gray-100 cursor-pointer"
          >
            <Laptop className="text-purple-600" size={28} />
            <span className="text-xs mt-1">Aula Interactiva</span>
          </div>
          <div 
            onClick={() => navigate("/dashboard/meus-cursos/atividade/criar/1?tipo=FORUM")}
            className="flex flex-col items-center p-2 border rounded-lg shadow hover:bg-gray-100 cursor-pointer"
          >
            <MessagesSquare className="text-yellow-600" size={28} />
            <span className="text-xs mt-1">Forum</span>
          </div>
          <div 
            onClick={() => navigate("/dashboard/meus-cursos/atividade/criar/1?tipo=ROTULO")}
            className="flex flex-col items-center p-2 border rounded-lg shadow hover:bg-gray-100 cursor-pointer"
          >
            <Type className="text-gray-600" size={28} />
            <span className="text-xs mt-1">Rótulo</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DetalheCurso;