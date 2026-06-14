import { useState } from 'react'
import ReviewWalkthrough from './components/ReviewWalkthrough'
import VideoReview from './components/VideoReview'
import Quiz from './components/quiz/Quiz'
import TeacherPortal from './components/teacher/TeacherPortal'

const PAGES = {
  REVIEW: 'review',
  VIDEO: 'video',
  QUIZ: 'quiz',
  TEACHER: 'teacher',
}

export default function App() {
  const [page, setPage] = useState(PAGES.REVIEW)

  if (page === PAGES.TEACHER) {
    return <TeacherPortal onBack={() => setPage(PAGES.REVIEW)} />
  }

  if (page === PAGES.VIDEO) {
    return (
      <>
        <VideoReview onBack={() => setPage(PAGES.REVIEW)} />
        <TeacherLink onClick={() => setPage(PAGES.TEACHER)} />
      </>
    )
  }

  if (page === PAGES.QUIZ) {
    return (
      <>
        <Quiz onBack={() => setPage(PAGES.REVIEW)} />
        <TeacherLink onClick={() => setPage(PAGES.TEACHER)} />
      </>
    )
  }

  return (
    <>
      <ReviewWalkthrough
        onComplete={() => setPage(PAGES.QUIZ)}
        onWatchVideo={() => setPage(PAGES.VIDEO)}
      />
      <TeacherLink onClick={() => setPage(PAGES.TEACHER)} />
    </>
  )
}

function TeacherLink({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 px-4 py-2 rounded-xl text-base font-bold text-white/40 border border-white/10 hover:text-white/80 hover:border-white/30 transition-all z-50"
      title="Teacher dashboard"
    >
      Teacher
    </button>
  )
}
