import { component$, useSignal, useStore, useTask$, $ } from '@builder.io/qwik';

// Definição da interface para os itens da lista
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

// 1. Declaração do componente delimitado pelo delimitador de compilador component$
export const TaskManager = component$(() => {
  // 2. Estado primitivo reativo para o campo de texto de entrada
  const inputText = useSignal('');

  // 3. Estado complexo reativo (Store) para a lista de tarefas
  const state = useStore<{ tasks: Task[] }>({
    tasks: [
      { id: 1, text: 'Estudar Arquitetura do Qwik', completed: true },
      { id: 2, text: 'Apresentar Seminário de Web 1', completed: false },
    ],
  });

  // 4. Efeito reativo / Tarefa assíncrona executada quando a lista muda
  useTask$(({ track }) => {
    // Monitora a propriedade tasks da store
    track(() => state.tasks.length);
    console.log(`[Qwik Task] O número total de tarefas mudou para: ${state.tasks.length}`);
  });

  // 5. Função de Manipulação de Eventos convertida em QRL ($)
  const addTask$ = $(() => {
    if (inputText.value.trim() === '') return;
    
    state.tasks.push({
      id: Date.now(),
      text: inputText.value,
      completed: false,
    });
    
    // Limpa o valor do sinal
    inputText.value = '';
  });

  return (
    <section style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Gerenciador de Tarefas (Qwik Demo)</h2>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={inputText.value}
          onInput$={(e) => {
            // Atualiza o valor do sinal a cada caractere digitado
            inputText.value = (e.target as HTMLInputElement).value;
          }}
          placeholder="Nova tarefa..."
        />
        <button onClick$={addTask$}>Adicionar Tarefa</button>
      </div>

      <ul>
        {state.tasks.map((task) => (
          <li key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            <span
              onClick$={() => {
                task.completed = !task.completed;
              }}
              style={{ cursor: 'pointer' }}
            >
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
});
