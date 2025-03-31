import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { supabase } from '../src/lib/supabase/client';

async function seedData() {
  try {
    // 企業データの格納
    const companyData = parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'マスターデータ.csv'), 'utf-8'),
      { columns: true }
    );

    const { error: companyError } = await supabase
      .from('companies')
      .upsert(companyData.map((company: any) => ({
        id: company.id,
        name: company.name,
        scores: [
          parseFloat(company.score1),
          parseFloat(company.score2),
          parseFloat(company.score3),
          parseFloat(company.score4),
          parseFloat(company.score5),
          parseFloat(company.score6),
          parseFloat(company.score7),
          parseFloat(company.score8),
          parseFloat(company.score9),
          parseFloat(company.score10),
        ],
        tags: company.tags.split(','),
        strategy: {
          steps: [
            company.Step1,
            company.Step2,
            company.Step3,
            company.Step4,
            company.Step5,
            company.Step6
          ].filter(step => step && step.trim() !== ''),
          interviewFocus: company['特徴・傾向（面接で重視されること等）'] || '',
          deadlines: company['締切・スケジュール'] ? company['締切・スケジュール'].split(',').filter(Boolean) : undefined,
          commonQuestions: company['例年の質問'] ? company['例年の質問'].split(',').filter(Boolean) : undefined
        }
      })));

    if (companyError) throw companyError;

    // 自己分析データの格納
    const selfAnalysisData = parse(
      fs.readFileSync(path.join(process.cwd(), 'data', '就活AI_自己理解設問構造化_修正版.csv'), 'utf-8'),
      { columns: true }
    );

    const { error: selfAnalysisError } = await supabase
      .from('self_analysis_questions')
      .upsert(selfAnalysisData.map((question: any) => ({
        id: question.questionId,
        question: question.question,
        category: question.category,
        options: [
          { value: 1, text: question.option1 },
          { value: 2, text: question.option2 },
          { value: 3, text: question.option3 },
          { value: 4, text: question.option4 },
          { value: 5, text: question.option5 },
        ],
      })));

    if (selfAnalysisError) throw selfAnalysisError;

    // ToDoデータの格納
    const todoData = parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'マスターデータ.csv'), 'utf-8'),
      { columns: true }
    );

    const { error: todoError } = await supabase
      .from('todos')
      .upsert(todoData.map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        category: todo.category,
        steps: [
          todo.Step1,
          todo.Step2,
          todo.Step3,
          todo.Step4,
          todo.Step5,
          todo.Step6
        ].filter(step => step && step.trim() !== ''),
      })));

    if (todoError) throw todoError;

    console.log('データの格納が完了しました');
  } catch (error) {
    console.error('データの格納中にエラーが発生しました:', error);
  }
}

seedData(); 