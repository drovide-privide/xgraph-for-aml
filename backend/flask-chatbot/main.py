from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime
from typing import Optional
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:*", "http://127.0.0.1:*"]}})

ml_cases = pd.read_csv('ml_cases_finale2.csv')
final_relationship = pd.read_csv('final_relationship_v_finale.csv')

ml_cases_cols = ['n_entities_involved', 'total_amount', 'ML_type']
final_relationship_cols = ['RECEIVER_ACCOUNT', 'SENDER_ACCOUNT', 'TX_TYPE', 'TX_AMOUNT', 'TIMESTAMP']

atwin_api = os.getenv('API_KEY')
oai_client = OpenAI(api_key=atwin_api)

class History:
    histories = {}  # Class-level dictionary to store all histories

    def create_chat(self, chat_id):
        if chat_id not in History.histories:
            History.histories[chat_id] = pd.DataFrame(columns=['timestamp', 'sender', 'message'])

    def append_to_chat_history(self, chat_id, sender, message):
        if chat_id not in History.histories:
            self.create_chat(chat_id)
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        new_entry = pd.DataFrame([[timestamp, sender, message]], columns=['timestamp', 'sender', 'message'])
        History.histories[chat_id] = pd.concat([History.histories[chat_id], new_entry], ignore_index=True)

    def get_history(self, chat_id):
        if chat_id in History.histories:
            return History.histories[chat_id]
        else:
            return pd.DataFrame(columns=['timestamp', 'sender', 'message'])

    def save_to_csv(self, chat_id, filename):
        if chat_id in History.histories:
            History.histories[chat_id].to_csv(filename, index=False)

    def load_from_csv(self, chat_id, filename):
        History.histories[chat_id] = pd.read_csv(filename)

    def history_to_string(self, chat_id):
        if chat_id in History.histories:
            df = History.histories[chat_id]
            history_string = ""
            for index, row in df.iterrows():
                history_string += f"{row['timestamp']} - {row['sender']}: {row['message']}\n"
            return history_string
        else:
            return ""

class Chatbot:
    def __init__(self, ml_id, user_id):
        self.history = History()
        self.ml_id = ml_id
        self.system_prompt = ''
        self.chat_id = f"{user_id}"

    def chat_with_model(self, prompt, model='gpt-4'):
        chat_history_str = self.history.history_to_string(self.chat_id)
        if chat_history_str:
            chat_history_context = f'''Berikut perbincangan pada pesan sebelumnya: {chat_history_str}'''
        else:
            chat_history_context = ''

        system_prompt = f'''Kamu adalah asisten analis fraud dari Drovide Pivide. 
        Kamu menanggapi pertanyaan secara singkat, padat, dan jelas berdasarkan materi: 
        {retrieve_context_chatbot(self.ml_id)} dan pengetahuanmu tentang fraud di institusi finansial.
        untuk tipe transaksi Direktur dan Komisaris maka penerimanya adalah perusahaan dan pengirimnya adalah stakeholder sesuai yang tertulis pada tipe transaksi dan hubungan.
        Untuk tipe transaksi Direktur dan Komisaris sebutkan sebagai hubungan jangan sebagai tipe transaksi. 
        Jangan dianggap sebagai tipe transaksi tapi sebagai hubungan stakeholder. Masa Metonia Abadi dan Linggar Jati Perkasa adalah perusahaan.
        {chat_history_context}
        '''

        completion = oai_client.chat.completions.create(
            model=model,
            temperature=0,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
        )
        return completion.choices[0].message.content.strip()

    def add_message(self, sender, message):
        self.history.append_to_chat_history(self.chat_id, sender, message)

def df_to_str(df: pd.DataFrame, sort_by: Optional[str] = None, ascending: Optional[bool] = 1) -> str:
    if sort_by:
        df = df.sort_values(sort_by, ascending=ascending)
    df_string = ""
    for index, row in df.iterrows():
        for col in df.columns:
            df_string += f"{col}: {row[col]}\n"
        df_string += "\n"
    return df_string

def retrieve_context_chatbot(ml_id):
    relevant_ml_cases_info = ml_cases[ml_cases['ML_ID'] == ml_id][ml_cases_cols]
    relevant_final_rel = final_relationship[final_relationship['ML_ID'] == ml_id][final_relationship_cols]
    ml_type = ml_cases[ml_cases['ML_ID'] == ml_id]['ML_type'].iloc[0]
    context = f'''*{ml_id}*
Terduga kasus money laundering jenis: {ml_type}
Informasi transaksi dan keterkaitan:
{df_to_str(relevant_final_rel, 'TIMESTAMP')}

Rangkuman:
{df_to_str(relevant_ml_cases_info)}'''
    return context

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_id = data['user_id']
    ml_id = data['ml_id']
    prompt = data['prompt']
    
    chatbot = Chatbot(ml_id, user_id)
    
    chatbot.add_message('user', prompt)
    assistant_response = chatbot.chat_with_model(prompt)
    chatbot.add_message('assistant', assistant_response)
   
    return jsonify({'response': assistant_response})

@app.route('/chat/history', methods=['GET'])
def get_chat_history():
    user_id = request.args.get('user_id')
    ml_id = request.args.get('ml_id')
    
    if not user_id or not ml_id:
        return jsonify({'error': 'Missing user_id or ml_id'}), 400
    
    chat_id = f"{user_id}"
    chatbot = Chatbot(ml_id, user_id)
    
    history_df = chatbot.history.get_history(chat_id)
    if history_df.empty:
        return jsonify({'error': 'No chat history found'}), 404
    
    history = history_df.to_dict(orient='records')
    return jsonify({'chat_id': chat_id, 'history': history})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
