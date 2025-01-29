import axios from "axios";

const chatbotService = {
  sendMessage: (message) => {
    return axios.post("http://localhost:8080/api/chatbot", { message });
  },
};

export default chatbotService;
