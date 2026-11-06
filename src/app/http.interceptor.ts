import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

export const loggingAndErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  console.log(`[HTTP Request] ${req.method} ${req.urlWithParams}`);

  return next(req).pipe(
    tap(() => {
      const duration = Date.now() - startTime;
      console.log(`[HTTP Success] ${req.method} ${req.urlWithParams} (${duration}ms)`);
    }),
    catchError((error: HttpErrorResponse) => {
      const duration = Date.now() - startTime;
      let errorMessage = 'Сталася невідома помилка!';

      if (error.error instanceof ErrorEvent) {
        // Помилка на боці клієнта або мережі
        errorMessage = `Помилка мережі: ${error.error.message}`;
      } else {
        // Помилка, повернута сервером
        errorMessage = `Помилка сервера ${error.status}: ${error.message}`;
      }

      console.error(`[HTTP Error] ${req.method} ${req.urlWithParams} (${duration}ms):`, errorMessage);

      // Тут можна додати сповіщення користувача (наприклад, через Toastr або alert)
      alert(`Помилка запиту: ${errorMessage}`);

      return throwError(() => new Error(errorMessage));
    })
  );
};
