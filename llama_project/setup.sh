# Clone llama.cpp
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp

# Build it
make clean
LLAMA_METAL=1 make

# Download model
export MODEL=llama-2-13b-chat.ggmlv3.q4_0.bin
wget "https://huggingface.co/TheBloke/Llama-2-13B-chat-GGML/resolve/main/${MODEL}"

# Run
echo "Prompt: " \
    && read PROMPT \
    && ./main \
        --threads 8 \
        --n-gpu-layers 1 \
        --model ${MODEL} \
        --color \
        --ctx-size 2048 \
        --temp 0.7 \
        --repeat_penalty 1.1 \
        --n-predict -1 \
        --prompt "[INST] ${PROMPT} [/INST]":
