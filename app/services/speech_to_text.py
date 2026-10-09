from faster_whisper import WhisperModel

print("Loading Whisper model...")

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

print("Whisper model loaded")


def transcribe_audio(audio_path: str):

    segments, info = model.transcribe(
        audio_path,
        beam_size=5
    )

    text = " ".join(
        segment.text.strip()
        for segment in segments
    )

    return {
        "text": text.strip(),
        "language": info.language,
        "language_probability": info.language_probability
    }


def translate_audio_to_english(audio_path: str):

    segments, info = model.transcribe(
        audio_path,
        beam_size=5,
        task="translate"
    )

    text = " ".join(
        segment.text.strip()
        for segment in segments
    )

    return {
        "text": text.strip(),
        "language": info.language,
        "language_probability": info.language_probability
    }