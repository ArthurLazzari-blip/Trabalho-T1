import { component$, useSignal, useStore, useTask$, $ } from '@builder.io/qwik';

// 1. Declaração do componente (interface removida)
export const TaskManager = component$(() => {
  // 2. Estado primitivo reativo
  const inputText = useSignal('');

  // 3. Estado complexo reativo
  const state = useStore({
    tasks: [
      { id: 1, text: 'Estudar Arquitetura do Qwik', completed: true },
      { id: 2, text: 'Apresentar Seminário de Web 1', completed: false },
    ],
  });

  // 4. Efeito reativo
  useTask$(({ track }) => {
    track(() => state.tasks.length);
    console.log(`[Qwik Task] O número total de tarefas mudou para: ${state.tasks.length}`);
  });

  // 5. Função de Manipulação de Eventos
  const addTask$ = $(() => {
    if (inputText.value.trim() === '') return;

    state.tasks.push({
      id: Date.now(),
      text: inputText.value,
      completed: false,
    });

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
            inputText.value = e.target.value;
          }}
          placeholder="Nova tarefa..."
        />
        <button onClick$={addTask$}>Adicionar Tarefa</button>
      </div>
      <ul>
        {state.tasks.map((task) => (
          <li
            key={task.id}
            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
          >
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
