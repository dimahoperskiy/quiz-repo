import { useState } from 'react';
import { getStats, QuizStat } from '@/api/quiz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const Stats = () => {
  const [stats] = useState<QuizStat[]>(() => getStats());

  if (stats.length === 0)
    return (
      <div>
        <Link className='absolute left-0 top-0' to='/'>
          <ArrowBackIcon />
        </Link>
        <p>
          Пока нет сохранённых попыток — они появятся после прохождения квиза в
          этом браузере.
        </p>
      </div>
    );

  return (
    <div>
      <Link className='absolute left-0 top-0' to='/'>
        <ArrowBackIcon />
      </Link>

      <div className='mt-8 flex flex-col gap-4'>
        {stats.map((stat) => (
          <div
            key={stat.id}
            className='relative rounded-lg border border-white/10 bg-white/5 p-4 text-white shadow-md'
          >
            <span className='absolute right-3 top-3 rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white'>
              {stat.correct} / {stat.total}
            </span>

            <p className='mb-1 text-sm text-gray-300'>
              Попытка от {new Date(stat.createdAt).toLocaleString()}
            </p>

            <div className='mt-2 flex flex-wrap gap-2 text-sm'>
              {stat.answers.map((answer, i) => (
                <span
                  key={i}
                  className={`rounded px-2 py-1 ${
                    answer.correct
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {answer.question}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
