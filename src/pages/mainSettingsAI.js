import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function AISettings() {
  const [transferConditions, setTransferConditions] = useState("");
  const [instructions, setInstructions] = useState("");

  const [name, setName] = useState("");
  const [behavior, setBehavior] = useState("");
  const [knowledge, setKnowledge] = useState("");
  const [startMessage, setStartMessage] = useState("");
  const [endMessage, setEndMessage] = useState("");
  const [lastTrain, setLastTrain] = useState("");

  const [model, setModel] = useState("gpt-4o-mini");
  const [noAdmin, setNoAdmin] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [assistantData, setAssistantData] = useState({});
  const [isData, setIsData] = useState(false);
  const [assistantId, setAssistantId] = useState(""); // Replace with your actual assistant ID
  const [nama, setNama] = useState(""); // Replace with your actual assistant ID
  const email = localStorage.getItem("email");

  const [activeTab, setActiveTab] = useState("general");
  const tabs = [
    { name: "General", key: "general" },
    // { name: "Knowledge Sources", key: "knowledge-sources" },
  ];

  useEffect(() => {
    getAssistant(email);
  }, []);
  const getInstructions = async (assistantId) => {
    try {
      const response = await axios.get(
        `https://apiassistant-mn76rlbdka-uc.a.run.app/assistant/get-instructions/${assistantId}`
      );
      console.log("isntructions", response.data.data);
      const data = response.data.data;
      if (response.data.data) {
        setBehavior(data.behavior);
        setStartMessage(data.startMessage);
        setEndMessage(data.endMessage);
        setKnowledge(data.knowledge);
        setLastTrain(data.lastUpdate);
        setIsData(true);
      }
      setLoading(false);
    } catch (err) {
      console.log(err.response ? err.response.data.message : err.message);
      setLoading(false);
    }
  };
  const getAssistant = async (email) => {
    try {
      const response = await fetch(
        `https://apiassistant-mn76rlbdka-uc.a.run.app/assistant/get-data/${email}`
      );
      const assistantData = await response.json();
      console.log(assistantData.data);
      if (response.ok) {
        console.log(" data:", assistantData);
        setNama(assistantData.data.nama_bisnis);
        setName(assistantData.data.nama_admin);
        setNoAdmin(assistantData.data.no_whatsapp);
        setAssistantId(assistantData.data.assistance_id);
        await getAssistantData(assistantData.data.assistance_id);
        await getInstructions(assistantData.data.assistance_id);
      } else {
        throw new Error(assistantData.error);
      }
    } catch (error) {
      console.error("Error fetching assistant data:", error);
    }
  };
  const getAssistantData = async (assistantId) => {
    try {
      const response = await fetch(
        `https://apiassistant-mn76rlbdka-uc.a.run.app/assistant/get-assistant/${assistantId}`
      );
      const assistantData = await response.json();
      console.log(assistantData.data);
      if (response.ok) {
        console.log("Assistant data:", assistantData);
        setAssistantData(assistantData.data);
        setInstructions(assistantData.data.instructions);
      } else {
        throw new Error(assistantData.error);
      }
    } catch (error) {
      console.error("Error fetching assistant data:", error);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://apiassistant-mn76rlbdka-uc.a.run.app/assistant/update-assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instructions: `${behavior}\n\n${startMessage}\n\n${endMessage}\n\n${knowledge}`,
            name,
            tools: [{ type: "file_search" }],
            model,
            assistantId,
          }),
        }
      );

      const myUpdatedAssistant = await response.json();

      if (response.ok) {
        console.log("Successfully updated assistant");
        console.log(myUpdatedAssistant);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Assistant updated successfully!",
        });
      } else {
        throw new Error(myUpdatedAssistant.error);
      }
    } catch (error) {
      console.error("Error updating assistant:", error);
      console.log({ error: error.message });
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to update assistant: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      assistantId: assistantId,
      behavior,
      start: startMessage,
      end: endMessage,
      knowledge,
      admin: noAdmin,
    };

    try {
      if (isData) {
        // Update existing record
        await axios.post(
          "https://apiassistant-mn76rlbdka-uc.a.run.app/assistant/update-instructions",
          payload
        );
        await handleUpdate();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Assistant updated successfully!",
        });
      } else {
        // Insert new record
        await axios.post(
          "https://apiassistant-mn76rlbdka-uc.a.run.app/assistant/insert-instructions",
          payload
        );
        await handleUpdate();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Assistant updated successfully!",
        });
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Error while submitting data");
    }
  };
  function formatDateTime(dateString) {
    // Pisahkan tanggal dan waktu dari string ISO
    const [datePart, timePart] = dateString.split("T");

    // Ambil jam dan menit saja dari bagian waktu (tanpa detik dan zona waktu)
    const time = timePart.slice(0, 5); // Ambil "15:48" dari "15:48:44.000Z"

    // Format tanggal ke dalam format: 14 Januari 2024
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);

    return `${formattedDate} (${time})`;
  }

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("email");
    window.location.href = "/";
  };
  return (
    <div className="min-h-screen bg-indigo-500 flex flex-col items-center p-8">
      <div className="w-[90%]  bg-white rounded-lg shadow-md p-6">
        {/* Title */}
        <div className="w-full flex justify-center items-center flex-col">
          <h1 className="text-2xl font-semibold mb-4">AI Configuration </h1>
          <div className="transition duration-500 ease-in-out transform opacity-100 scale-100 ">
            <div className="mb-8 flex justify-center items-center flex-col">
              <h2 className="text-xl font-medium mb-2">{name} AI</h2>
              <p className="text-gray-600 mb-4">Customer Service AI</p>
              <p>
                Last Trained:{" "}
                {lastTrain !== "" ? formatDateTime(lastTrain) : "Not Trained"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-around items-center border-b-2 border-grey-500 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`relative group text-lg font-semibold px-4 py-2 
              ${activeTab === tab.key ? "text-indigo-600" : "text-gray-600"} 
              focus:outline-none transition duration-500`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name}
              {activeTab === tab.key && (
                <span className="absolute inset-x-0 -bottom-0.5 h-1 bg-indigo-600 rounded-full animate-pulse"></span>
              )}
              <div
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-indigo-300 
              transition-all duration-300 scale-x-0 group-hover:scale-x-100`}
              ></div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8 p-5 bg-white rounded-lg">
          {activeTab === "general" && (
            <div className="w-full flex justify-between gap-6 items-start">
              <div className="w-[45%] ">
                {/* General Section */}

                {/* Chatbot Behavior */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">Nama Chatbot</h3>
                  <p className="text-gray-600">
                    Ini adalah Nama Chatbot Ai Anda
                  </p>
                  <input
                    className="w-full p-2 mt-4 p-3 border border-indigo-500 rounded-lg focus:outline-none"
                    value={name}
                    onChange={(e) => {
                      setNama(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Chatbot Behavior
                  </h3>
                  <p className="text-gray-600">
                    Ini adalah Prompt AI yang akan mengatur gaya bicara dan
                    identitas AI-nya.
                  </p>
                  <textarea
                    className="w-full min-h-[20rem] mt-4 p-3 border border-indigo-500 rounded-lg focus:outline-none"
                    value={behavior}
                    onChange={(e) => {
                      setBehavior(e.target.value);
                    }}
                  ></textarea>
                </div>
                {/* Welcome Message */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Welcome Message
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Pesan pertama yang akan dikirim AI kepada user.
                  </p>
                  <textarea
                    className="w-full min-h-[15rem] p-3 border border-indigo-500 rounded-lg focus:outline-none"
                    value={startMessage}
                    onChange={(e) => {
                      setStartMessage(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Closing Message
                  </h3>
                  <p className="text-gray-600 mb-2">
                    kalimat atau Pesan Terakhir yang akan dikirim AI kepada
                    user.
                  </p>
                  <textarea
                    className="w-full min-h-[15rem] p-3 border border-indigo-500 rounded-lg focus:outline-none"
                    value={endMessage}
                    onChange={(e) => {
                      setEndMessage(e.target.value);
                    }}
                  ></textarea>
                </div>
                {/* Save Button */}
                <div className="flex flex-col justify-center gap-6 w-full items-center">
                  <button
                    class="button-main mt-5"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? "Updating..." : "Update Instructions"}
                  </button>

                  <Link
                    to={"/instructions"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      "w-[15rem] p-2 text-sm rounded-xl flex justify-center items-center bg-indigo-500 text-white  "
                    }
                  >
                    Lihat Infomasi Lama
                  </Link>

                  <button
                    onClick={handleLogout}
                    className={
                      "w-[15rem] p-2 text-sm rounded-xl flex justify-center items-center bg-indigo-500 text-white  "
                    }
                  >
                    Logout
                  </button>
                </div>
              </div>

              <div className="w-[55%] flex flex-col justify-start items-start">
                <div className="mb-6 w-full">
                  <h3 className="font-semibold text-lg mb-2">
                    Chatbot Knowledge
                  </h3>
                  <p className="text-gray-600">
                    Ini adalah Prompt AI yang akan mengatur gaya bicara dan
                    identitas AI-nya.
                  </p>
                  <textarea
                    className="w-full min-h-[52rem] mt-4 p-3 border border-indigo-500 rounded-lg focus:outline-none"
                    value={knowledge}
                    onChange={(e) => {
                      setKnowledge(e.target.value);
                    }}
                  ></textarea>
                </div>
              </div>
            </div>
          )}
          {/* {activeTab === "knowledge-sources" && (
            <div className="transition duration-500 ease-in-out transform opacity-100 scale-100">
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">
                  Chatbot Knowledge
                </h3>
                <p className="text-gray-600">
                  Isi Pengetahuan yang akan digunakan oleh AI untuk menjawab
                  pertanyaan user.
                </p>
                <textarea
                  className="w-full h-40 mt-4 p-3 border border-indigo-500 rounded-lg focus:outline-none"
                  value={knowledge}
                  onChange={(e) => {
                    setKnowledge(e.target.value);
                  }}
                ></textarea>
              </div>
              <div className="text-right">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none">
                  Save AI Settings
                </button>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default AISettings;
