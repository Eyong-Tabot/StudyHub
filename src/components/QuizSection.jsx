// Quiz section component.
function QuizSection() {
    return (
        <section
            id="quizzes"
            className="container my-5"
        >
            {/* Section heading. */}
            <h2 className="mb-4">
                Quizzes
            </h2>

            {/* Current placeholder quiz card. */}
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">
                        JavaScript Quiz
                    </h5>

                    <p className="card-text">
                        Test your JavaScript knowledge.
                    </p>

                    <button
                        className="btn btn-primary"
                        type="button"
                        disabled
                    >
                        Quiz Coming Soon
                    </button>
                </div>
            </div>
        </section>
    );
}

// Export QuizSection.
export default QuizSection;
