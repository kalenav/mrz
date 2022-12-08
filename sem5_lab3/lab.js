const matrixModule = (function() {
    function calcDeterminant(matrix) {
        try {
            if (matrix.length !== matrix[0].length) {
                throw "Non-square matrix passed to the calcDeterminant function";
            }
            if (matrix.length === 2) {
                return matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1];
            }
            else {
                let determinant = 0;
                for (let column = 0; column < matrix[0].length; column++) {
                    const currMultiplier = matrix[0][column];
                    const sign = column % 2 === 0 ? 1 : -1;
                    determinant += calcDeterminant(ignoreIthRowAndJthColumn(matrix, 0, column)) * currMultiplier * sign;
                }
                return determinant;
            }
        }
        catch(err) {
            console.error(err);
        }
    }

    function ignoreIthRowAndJthColumn(matrix, i, j) {
        const newMatrix = [];
        let skippedRow = false;
        for (let row = 0; row < matrix.length; row++) {
            if (row === i) {
                skippedRow = true;
                continue;
            }
            newMatrix.push([]);
            for (let column = 0; column < matrix[0].length; column++) {
                if (column == j) {
                    continue;
                }
                newMatrix[row - skippedRow].push(matrix[row][column]);
            }
        }
        return newMatrix;
    }

    function getLinearSystemSolutions(coefsMatrix, answers) {
        const mainDeterminant = calcDeterminant(coefsMatrix);
        const solution = [];
        for (let columnIndex = 0; columnIndex < coefsMatrix.length; columnIndex++) {
            const currDeterminant = calcDeterminant(replaceColumn(coefsMatrix, columnIndex, answers));
            solution.push(currDeterminant / mainDeterminant);
        }
        return solution;
    }

    function replaceColumn(matrix, columnIndex, column) {
        const newMatrix = [];
        for (let i = 0; i < matrix.length; i++) {
            newMatrix.push([]);
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i].push(j === columnIndex ? column[i] : matrix[i][j]);
            }
        }
        return newMatrix;
    }

    return {
        getLinearSystemSolutions,
    };
})();

function convertSequenceToLinearSystem(sequence, window) {
    sequence = sequence.split(' ').map(el => Number(el));
    const coefsMatrix = new Array(window);
    const answers = [];
    for (let offset = 0; offset < window; offset++) {
        const subsequenceEntrypoint = (sequence.length - 1) - window - offset;
        const subsequenceEndpoint = subsequenceEntrypoint + window;
        coefsMatrix[window - offset - 1] = sequence.slice(subsequenceEntrypoint, subsequenceEndpoint);
        answers.unshift(sequence[subsequenceEndpoint]);
    }
    return {
        coefsMatrix,
        answers
    }
}

function predictNextNumber(sequence, window) {
    const linearSystem = convertSequenceToLinearSystem(sequence, window);
    const nextLearningSelection = linearSystem.answers;
    console.log(linearSystem);
    const weights = matrixModule.getLinearSystemSolutions(linearSystem.coefsMatrix, linearSystem.answers);
    alert(dotProduct(weights, nextLearningSelection));
}

function dotProduct(vector1, vector2) {
    return vector1.reduce((acc, el, index) => acc + el * vector2[index], 0);
}