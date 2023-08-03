export MODEL=llama.cpp/llama-2-13b-chat.ggmlv3.q4_0.bin

echo "Prompt: " \
    && read PROMPT \
    && ./llama.cpp/main \
        --threads 8 \
        --n-gpu-layers 1 \
        --model ${MODEL} \
        --color \
        --ctx-size 2048 \
        --temp 0.7 \
        --repeat_penalty 1.1 \
        --n-predict -1 \
        --prompt "[INST] ${PROMPT} [/INST]":
