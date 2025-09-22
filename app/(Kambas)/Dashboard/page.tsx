import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/Courses/1" className="wd-dashboard-course-link">
            <Image alt="" src="/images/Course1.jpg" width={200} height={150} />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/2" className="wd-dashboard-course-link">
            <Image alt="" src="/images/Course2.jpg" width={200} height={150} />
            <div>
              <h5> CS1235 Java </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/3" className="wd-dashboard-course-link">
            <Image alt="" src="/images/Course3.jpg" width={200} height={150} />
            <div>
              <h5> CS1236 Vue JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/4" className="wd-dashboard-course-link">
            <Image alt="" src="/images/Course4.jpg" width={200} height={150} />
            <div>
              <h5> CS1237 Professional Development </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/5" className="wd-dashboard-course-link">
            <Image alt="" src="/images/Course5.png" width={200} height={150} />
            <div>
              <h5> CS1238 Cloud Computing </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/6" className="wd-dashboard-course-link">
            <Image alt="" src="/images/Course6.jpg" width={200} height={150} />
            <div>
              <h5> CS1239 Web Dev </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/Courses/7" className="wd-dashboard-course-link">
            <Image alt="" src="/images/Course7.jpg" width={200} height={150} />
            <div>
              <h5> CS1256 SQL Database </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
);}
