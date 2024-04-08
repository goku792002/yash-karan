from openai import OpenAI
import os
from database import create_connection, insert_thought

client = OpenAI(api_key='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')

# Directory where the audio files are stored
audio_files_directory = "/Users/Yash/Desktop/CMU/CMU year 4/Sem 2/Capstone/bellaRecordings"
# transcription_output_path = "/Users/Yash/Desktop/CMU/CMU year 4/Sem 2/Capstone/all_transcriptions.txt"

# List all WAV files in the directory
audio_files = [file for file in os.listdir(audio_files_directory) if file.endswith('.WAV')]

# Loop through each audio file
for audio_file_name in audio_files:
    # Construct the full file path
    audio_file_path = os.path.join(audio_files_directory, audio_file_name)
    
    # Open the audio file
    with open(audio_file_path, "rb") as audio_file:
        # Create a transcription for the audio file
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="text"
        )
    
    # Print the transcript
    print(transcript)

    # Insert the transcript into the database
    conn = create_connection('thoughts.db')
    with conn:
        insert_thought(conn, transcript)
        print(f"Transcript for {audio_file_name} inserted into database")