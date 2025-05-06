import { UserRole } from '../generated/prisma/index.js';
import { db } from '../libs/db.js'
import { getJudge0LanguageId, poolBatchResults, submitBatch } from '../libs/judege0.lib.js';

export const createProblem = async(req, res) => {
    try {
        const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions} = req.body;
        
        if(req.user.role != UserRole.ADMIN){
            return res.status(403).json({error: "You are not allowed to create a problem"})
        }

        for( const [language, solutionsCode] of Object.entries(referenceSolutions) ){
            const languageId = getJudge0LanguageId(language);

            if(!languageId){
                return res.status(400).json({error: `Language ${language} is not supported`})
            }

            const submissions = testcases.map(({input, output}) => ({
                source_code: solutionsCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,
            }))

            const submissionResults = await submitBatch(submissions);

            const tokens = submissionResults.map((res) => res.token);

            const reusults = await poolBatchResults(tokens);

            for(let i=0; i<reusults.length; i++){
                const result = reusults[i];

                if(result.status.id != 3){
                    return res.status(400).json({
                        error: `Testcase ${i+1} failed for language ${language}`
                    })
                }
            }

            const newProblem = await db.problem.create({
                data: {
                    title,
                    description,
                    tags,
                    examples,
                    constraints,
                    testcases,
                    codeSnippets,
                    referenceSolutions,
                    userId: req.user.id,
                }
            })

            return res.status(201).json(newProblem);
        }
    } catch (error) {
        
    }
}

export const getAllProblems = async(req, res) => {
    
}

export const getProblemById = async(req, res) => {
    
}

export const updateProblem = async(req, res) => {
    
}

export const deleteProblem = async(req, res) => {
    
}

export const getAllProblemsSolvedByUser = async(req, res) => {
    
}