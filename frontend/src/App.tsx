import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Blog } from './pages/Blog'
import { Blogs } from "./pages/Blogs";
import { Publish } from './pages/Publish';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/users/signup" element={<Signup />} />
          <Route path="/users/signin" element={<Signin />} />
          <Route path="/posts/:id" element={<Blog />} />
          <Route path="/posts/bulk" element={<Blogs />} />
          <Route path="publish" element={<Publish />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
