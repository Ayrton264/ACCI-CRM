import { useState, useEffect, useRef, useMemo, useCallback } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const LOGO_SRC = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCABVAPoDASIAAhEBAxEB/8QAHQAAAgIDAQEBAAAAAAAAAAAAAAgGBwMEBQIBCf/EAFcQAAEEAQIDAwUJCQsJCAMAAAECAwQFBgARBxIhEzFBCBQVIlEWFzJWYXGBlNEjUmKRlaGi0tQzQlRXcoOTscHT1RgkNFVkc3WCkiY3Q0ZTY3Tkdpa0/8QAGgEAAgMBAQAAAAAAAAAAAAAAAAMCBAUBBv/EADsRAAECAwUEBgYLAQEAAAAAAAECEQADIQQFEjFBE1FhgRQicZGh0VKSscHh8AYVIzJCU1RicoKiJPH/2gAMAwEAAhEDEQA/AEy0aNGiCDRo0aIINTDhfiXult+2msyF1cZxtDrbH7tLecVysxWfa64roPYOZR6JJ1H8cp51/dxaitaDkmSvlTudkpHipRPQJA3JJ7gDpq8Mj45wx4bnObFCnqqE0WqSOpPZLsX3kEGQdxzBUgAhPTduKlStgp4amhOI/Pz8aQubM2aXZychvPznuDnSCP5OT8lhD7OJ4yW1jdJRY2bifoWljlUPwh0PeOhGsn+TZM+KWN/XbX+40rWWZTe5Tkk7ILmwefnTnS66oKISPAJSP3qUgBISOgAAHdrl+dSf4Q9/1nUsUv0T3/CIBE7VQ7vjDaveTk6wEqkYzikdClpQHH7G0bbClHZIUosbJBJA3PiRqk+MGAw6SJ6epo0qtaQ6zFs6WYhYkVklTXPsVKGzjS9lFtwdFAb68eTflSaHizWM2spz0PchdPZBS/V7GQOTmJPQBCyhe/4Gr44iUL9tj4pZ5HnTjMjGJQU8OVMuOXJVcvbx35ZjA/lIGm7FK5CpqM0kOOB176cxCOkLl2lMmZUKBY5VGY10ryMJ3rfoaezvrRqsp4T0yY6fUabTudvEn2AeJPQa1EMvLkCOltReK+QIA6lW+223t3003CvB6LF8QtLXJlpZpaoH006ts7T5KSkKZI6FbDS1JaDQIDz/ADBRKGlb10pKiwi3MmCWnEYr3CeCptWQ+pc6+O/KTUltqClQOxSZrxS2s/7kO7atau8nVyOlLrmMY1Ba233spk+afpKUR0fiOqp4h+UTmt3JciYpJcxWoSnsmkw1BMtbY6DnfACk/wAhvkQO4J6b6qGzsbCzlKlWU6VNfV8J2Q6pxZ+lRJ1I7MZOfDw+MLacqpIHj4uPZzhxBwUpEeq47wzQrxHmDp/rsN9ffeXof4Rwz/J6/wDEdJho1zGPRHj5wbNfpnuHlDn+8vQ/wjhn+T1/4joc4EQZSSmJG4dSSfBuDLB/G3NXt+I6TDRoxJ3e2DZzPT8BDUZP5PCY7IS/ii0Oq5jz0FmtT3Qb+rEmttl35m3FH2A6orOOHtrjrjEiG4LirlPqjR5cdpaSH0nZTDragFtPJJG7agD1B7iNe+H3FHNMKlNisuH5FbzDt6qYtTsOQnfqlTROw/lJ2UO8EHTbOMRMquYVtXXM+mXf1Uew86bUguToJQSqPJcVuGn2OVaUzQO0QhChurdOnS7PtwdlmKsd296Za8KvCZtq6MU7bIlnAOegIrno2tGhasQ4N2E+Upi2VOVMaI7etqo6X34+++3nDq1JYjnp8FxYV+Dq26Pyc3lRWn04lVsJ23LtpbSZe/ylMZpDY+h0/PqH8RuPzlV/2W4SR4tNSwSWmrFuMA46eu6mEK37BBO55ju8r4S17kgUjkGR5BkMkyb68s7V4ncrmSlvK/GonSzs00z8Pd5dkNG2XWifE+0AePbDdI4I1DA5JB4aMqHeDBfJ/Tng/m1995eh/hHDP8nr/wAR0mGjUcQ9H2+cd2a/TPcPKHP95eh/hHDP8nr/AMR1994+rfHLGRw2fUe4Jr5G/wChPJ/NpL9GjEPR9sGzmen4CG1v/J47KI4/IxSmdSeiF1lvJgL6/eiW2plR9gLqd/bqG0fCCgiXrlO6kT7WTJLSK28L1fIrWm2XHnHn0NBZWkhCEoW3zIWVjZW/TVN4hmeV4hMTLxnILGrcB3KWHyG1/ItHwVj5FAg6c7gvmUfMarFsylV8JK0LlxJ57Pb0c7HQmQ92B/etPNBCi0d0pVzcu2nyZSJymFGryFTpQs+/zRaJ02zoxHrPQMMiaBw9Q7Aszbt0Q/ybJnxRxz67a/3Gg+TZLA39yOOfRNtf7jSoW1vPs7WXYyZLpelPrfcPOeqlKKj+c6s3yTm3pHGyssXlOux6aLLtHUlZ2+4x1qR+nyaWnAogBJc8fhDV7VCSorDDh8Yn17wex6LIRQWdPDrXrePF9DX1W/NmQkyX3uzRHe5209msgE7K223Hy6XC1hpgWkuCZCXTHeW1zpHRXKojcfIdtN+uRHrsUp3HwoKct5lq4od3JX17ikE/J28lr6dtJw84p11bqzupaipR9pOm26zps1oXKSXAhV2WtVssiJ6wxUMuceNGjRqpF6DQOp2GjVp8C8Jl21nGulRGnlqeU3VtSB9xW6gBTkh32sMJPOoAEqVyNjqsaAHoI4SAHMWFwC4aIajvm5SmOgsCRevvK7NtmNy9qmEV96QtA7WQRtys8qN+Z4DVa+UJxKc4iZhvBU43j9bzNVjSxyqWDtzvrT3BbhAOwACUhCB0SNWF5TGbRMbpRwkxeS4tSVdrkMxxfO886pXaKacX4uKWe1eI39fkbB5WttLlpqzhGAc+34fOkIlArO1VyG4eZ8Awzd5Bw8xK1zjL4GNU6UCRKX67zp5Wo7QG7jrh8EISCon5Om52GpT5QeB1WDZZBTjcmRMx20r2pVfJfBC1lO7bwV0Gyu0Qs7eAUnVzcN8Nd4eYcmlMZasxyJDZtkpR90isKIUzBT4hajyrcHTryJO+x174+Y5WX3A+SqnsRazsLslmU4hKuVpSi23Njt+CkoWuMvm7jus6vLu/Z2MTlllKyH7dT7D2RnS712tvNnlh0JDKV+45D2jthTdO1VWUzPMNrbuvfUm0ymnQ405ugcl9XLSptXXu53GUfOJB9ukl0xHkrX8iTiGR4sy6Uz6d5rJaohI3BbKW5I3P4JaXt/7Z0q7lDbbJWSxhPPI8ixh17IVsNsgdaWQocsxzS8R2XTRo3GGTlFRFBgPV6chqmSkOAOvhIjsq8CRJcQgj2gjUm8riejGcdxDhVWuq83hQ0zpythu+vdTbRVt13Ozzx9pkE6saVBpzmECojI7N+VfxrWub5UpBqHg7YrQAnvDUxh1s+zdI9ml78qazFnx6yjkcK24L6K5HXu83aQyf0kKP06rlJlpINC7d2Y72i0FJmzEqSXAD9+R7n747XAnHODWWVnojKJN5Fy4uHzdtVkzEhzAT6qG3FNqCHNumyyAo9x67CwJHB7hdHlPxX8Tz5t+OrlebNm1zNn2HaP0/t0sdHXv291BqYo3fmyW47Q/CWoJH5zp3cpv/AHL3GZW8R19FTjVU5Ebi9uoIfS0lMWO0sg7lKnCknrv37EHWjdkuRMRMM1AISHdyOVDr2RlXzOtEqZJTImFJWrCzJPOo01rFeo4T8K0nZOHZy8T9/aJH9UfWT3puGPxDzb8q/wD19Luc8zkjY5nkZHs9KPfraw+7PMPjXe/lB39bUel2H9P/ALVE+gXj+r/wmGLf4P8AC59soXimf1w/9diah5Sfl5FsAH5tx8+qI4v4M9w/zFVKZybCG/GamwJYb7Mvx3U8yFFBJKVd4KfApPeNfcQz+/rcrqLG2yHIpdfFmsvSmG7FwKdaSsKUgbq23IBHX26Z2RnuL5CzDsm5fD5yOuI2GEZD5g9OZTtv2bilJ3GxKunhrmCz2stKAlkb1Fj36x3aWuwDFOUqcD6KQ4PJqZ+G+Ew01fFK0dwzyUsQbZe7O0yWjjViFBRC0Q+Zcl/bbwV2sdBH3pV7dSFi7xyQ+3HZ95t111QQhCYtcSpROwAHLrgeU7jOWZnIwyAlthQr6dbjnYtBDba3X1gIQlPqhIbabA26bAaXOsirNLKxMSp6dUvnXdwhki2ptk1KDKWlut1gwpTed7xS3BCHwpsriTXcTpd1AS+EpgS4byG47a+u4fJQtQSTy+sAeXruNuoumw4L8MIMluO/jOauKdaDzK490w82+2RuHG1oYIWjbxH07aq6HwKyZ4br5gPkb0wmM0EzFWOH2CR7R+C9XwkyZklpZSth2StTz6t/YlsJG3d0+U6bdMmVOmlE1AIYl3IZuyFX7aJ1nkJmSVlKioBgAXc8REFTwm4VIO4xLOnPwV2aAPzR9ZRwm4YEbjA822/4r/8AX1SOc8Ucru8yuLeryG8q4MyY69GhsWLyUMtqUSlIHNtvttvt0337tcBWaZiokqyy+JPeTYu/raOl2H9P/tUHQLx/V/4TDGK4R8MFpKDhGdNA/v27MFQ+YGPtqpOOnDKHg3oy3o582XSWq3mm257IalxHmuXnadA9U9FoUFDbcHuG3WG+7PMPjXe/lB39bTT4xxSx3IMLq0RpuPx0wiGHWMtfhvvl1DDKC832gKglexBJO5KTrn/LajgloEs7yot2F47/ANliG0mzDNG4IAPaGaE8SlSjskEn5BppeCKX6XyQsxuHGXA4t6xETYHfd2PHicw+l5Y/5dS1OaVafg2/CVPzIr/s1YuIOV9vhs9WXT6luofXHbg+i0NCMtO6nzyhvZJJUASfkGuLsJkIVM2qSwyBc1pu4wJvIWpaZJkrS5FVJYdXrb+EIvgmOxTk8JeYU189Q8x88TWciZPLynYo5wQdjsdvEAjpvvpnaLDMHwatsL/AYN1PjXkJVYzaP2CHm0IWtC1traDSFtPEI5eVXtO2+rO5eEMDvcW5t7Aka43EyxxxzAIAxOP2MedaOKcUD6zimGwkdR7C5+PRc6ErtiEqS9eNGq/hrB9IFql3fMWlRTThV6NUcdGMVhxmkyqfAn47zfZCHiYbUlQ2Uh+ysCrqO8HsYQ+g6UzTI+VZOS3Gv2kSnH3JGQR6tanFEqWmvgMoJJPf92ee6+3fS3apWmbtpy5m8k95jRsckSLPLlD8IA7hBo0az18OVYTmIMJhciTIcDbTSBupaidgANJizHYwbHTkVwWn3zErYqO3sJfLuGGQQOg8VqJCUp71KUkDqdNBkdw3wa4eizar2o+Y2rPmdPASntTWsNElIJI2PYqVzrO2zkpXdysjW55NfDSMwmM+t9j0fXv9u7NAHLImIUUKkJWehbYUFNM7dFvdo56waGrVyHh7h1vduW91ewVPFCGWkJ3UlhlA2Q0j8EDf5yST1OnD7NOLU5efl37jFZX2y8H4RnxO7lmeQ3iPzvXX3E2Q5IcizH3nVFbji0qKlqJ3JJPeSfHVy+TtgZgOL4kZPXhUWtfLVLCfHSbPA3CynvLTPRSu4FXKnc+sNNTAwbhegvBNkhxMdhUh9aGujTae9RPh4Ae0kagFnYwbqe/by4T8TFqRlDUeBEbKnVIKuVmK0kfCffc6e3cqJOydXrssaJyjNnUloqePDn85xm3zeC7OhMiz1mzKJ4bzy+co7jdbT48lzIrjLPPvSzLqI9rCiyldg85uFuB5tCgh/YnYKAI33HXu5XD+h4W4tX2NRWW0pVXbgtWDLzM13naU0404EAtJCVKS51PtQj70a5VHn78TKbGKmdVvWKVD0lGpIYKYh39aO5E3KZzDYPL2zWzo2J5VAb6trG8ux6yqIz0GjpVzZIPmhbkBUOw26ER3ieUL3/8ACXyqB6HrptpnzLUozUHFRmaoHYKEcRzAhVkskqxJEmYCly7g9UntNQX0PImEqb4HZMuS6hC+0aS4pLbiWiO0SCQlWx6jcbHY92+rC4LcKMkwziNS5KpC3ozD/ZTWS3uHIzqS28kjx9Raj841cd35QVBST5FdLpoVZOjL5H40lns3WlexSVdR/b4aj07yqq9oER3YSP8AdtA/2axn3R6AgGhiY4VjUdGbQ401wGxxOc9WNJUgbyIktxKgd+/1S2tQ+R46rGZ5NNre3tjdWEaQ5IsJj0twq3HVxxS/7dTnGM5g5OyzxbriVOx6izbnISg/6bDjqUk7e1TSkKA+Q+zVPzvKkuXUAJcnKO3X1gP7daN5LRMUmYn8QxHtND4iMe6JS5SVyl/gOEfxFU+CotPh95N8PGMtqclnRUJaqJAnncgkloFaf0kp1WXGiyUxwQvJTqyZF3dRIp/CSkOSHD/1Bv8AHriwfKcyGHdRLDzJyY2y6C7Hee2S82QUrQeh23SSN+ux2OpXKvOAufYqzTW2XzqyO3MXNjxpaXIsiMtaEoKFOJaeadACRsfVPf7ddss9CLLOlOylYW7AawW2zTF22RPZ0oxP2kMKawqWjTI+9l5OvhxRVt/xdP7FoPDbycWvXd4nOqQO8JtQSfoEInVHZHeO8ecaPSE7j6qvKKj4MYSjPs3boXpEqPH7Bx51yM0HHOmyUJSCQN1OKQnqf32rwe8mPE2VqQ9xBbaWhRSpK5cEFJB2IP3bvB1zTn3CHhTWzHeFi5FzkchstszFsudmyf3q1reCSsIVstKENpSpSUlRPKkaXV2wnukl2bJWSSSVOk7k9579TdEsAMFHn5iIATZqiXKRpl31B+RDVYj5P2I1OXU9hAzyJZT4s1p+LB8/hAyXUKCkt9HSepSAdgTtvq2so4y4TiVu9jkpiukzKdLcF91w9SttACunyK30rfkZUvpnj5Tz5bgEKmSuwkLWe4jZtofOXXGxquuKTj73E3KnZO/bruZinN+/mLy9/wA+ormOlgkAc/eTv8YlLlYVklZJbVqA9gGbeEOK/wCU7jgfbjQI1aHHXEtoCGQeqiAP69eeLFsuPkvErIN9jW1M1ptR/erU2mK2f+pzppGm1rbcS42opWkhSVDvBHjpr6/ilwp4g01s3mNtJx2ZfxWmbiGtlwNLeQ4hwvR32kOcqVLbBKHEdCSNyNjq5d9oRJTNBLFSWHOKF6WWZPXIUkOlCwo8sj81hTtGmSVw08nNZ5kcT1pSe4G3H7Fr572fk6J6q4oLIHftbp3/AP4tUtkd47x5xodITuPqq8ooPEKhWQZXUUKHOyVYzWYvabb8naLCebb5N9/o0wM/yfuHVdJ82tOKUWrk8iHDGnTILD6ELSFIKkKe3TukpVsfAjXqvsPJz4bSfTVJYz8ntWEKDLDXauKUVJII7VbTTbYIJBWELUASU7K2IoHOclssxy+0ye3UgzbGQp5xKAQhAPRKEg9yUpASB7ANT6ksVAUedO5oh9pNVQlKR2Oe8Fm5Zxeh4GcKtv8AvmpfypA/vtbnlaSZ2EY3gOEVs16N5rDckr5HEkuNhLcdhaij1SShlaunT1zqhOHOOv5bntHjUdClrspzUdXKPgoKhzq+ZKeZRPsB1aflyXDVn5QNhFj/ALhVwYsJsDuA7MObD6XTqJmukgJA7/eTEkyWWFKWS29vcBFOvXdw9+62ctX86dOFwtqXE4zwkxuQO0D0dNk/ueqhKlLdJP8ANJT9GkwZbW86hppJW4tQSlI7yT3DTx5OpGO22TOwn+RGJ4q9Fiq+9cZhJitgfzqxrRujqTJk70EKPPIe2Mn6QfaSpVn9NaRyzPshcPKDuV2jeOOONhp6e1Mu3kDxVNmOvIJ/my2Po1VGp9x+IY4ly6ZDnaNUkaNUtqB33EdlDf8AWk6gOsmN6DV+eTtw4lzpkeQtMhmfPZC+1aAC4MJZKeZKldESHyFNtnryIDrp2CAdV9wZxFGU5C6t9MaS1Bb7ZEB2W2wqe7vs2wlSyAApW3MfBO+wJ2GmZw3MaCtxyzp3J9TV5MxJXEvm7+ygmNMfWjlkdmkKP3JCQlhABCUtjlHXn3dZ5aZkwJUQO2g79IrWyauTJK0JJPAOeQ1bd7oq3jPxydRdpxfAxFaxypCWUOs7huU6hPJzoG/RlCRyNjr6o5iSpZ2rpjiLnVxYR6+C8p+XKdSywyy0VLccUQEpSO8kkgAaY/z7Cv4NwJ/oq/7dZoV3jdfIEuomcGaicgKDU2AqAxIZ3BBKHEndJ2JG469daBu0rU5nS/W+EZaL3TLRhTZ5tP2fHXUx8pqe3qaiLw+jyVWuQzpCXLyQhQ5XJI+DGQR07Fgb7nuK+dXQDUQ4u51CxrHoxpXw6hsuox88/wDpT5HZyLdSR02+EzHB3ISFr6cyTrvC5xFiLIx1rLscW9Mhrdt5abhtCBD32EBh3fYvSFfuiwfUaCh8JQ1RmaY9eZXkMi6sMnwdtbmyGmGr6MlqO0kbIabSFbJQlIAAHQAaleVqlpQLJZz1E5n0jv8AnyiF0WKcqYq32sNMXkPRToO3f/7FcMSpLEtMxmQ63JSvnS6lZCwr279+/wAurcwDi683KcZyB1MeRLITInhjtmJmx6eextwHT3/dkFDyd9+Y7baiR4dTR/5pwr/9gj/ra+Dh1NJ2GU4WT/8AkEYf1q1kJUUkEFjG8pIUClQcGL54+0qM34JHKGW1Lt8VnLZfSpxTy243MhDjSXSkKdaSXIz7al9Q2+r2E6VLTb8LrO3xXGlSMliR1V0+vRDnPF1mUxu2ewZlqSpZS/FWy92LvZhRSGUKPdrq+fYV4xuBH9FXfbq/Ls/S3XtEpOuItzy7+LxmTbX0H7PZLUNMIxMNxrppwaK48jDKW4tvf4fNZEtifFM+NFUSe2cYQtL7KB985FcfHzoTqteL/Da2wK450hdhjcxRXUXDad2ZTR+CCf3joHRTZ2KSD4bEs3U5BjlRYs2VRI4J1s5glTMqL5g262SCN0qB3HQkfTr5WZPi+OY1cSpXEmgjpK2z5lClMWbMpC1cqwuKCrfl3SrmAJCd+h21aN3yhJOOchxkxeh0OtDWj5mKQvWcbSNlZ14VCrpZiMiHLFxSpGQrCVaNOUyMCveUw8d4OXS1jm3jFuI4d/Eo7Rog/wDLrOrCsaDYdVwq4fhBOwV6S2BPyf51quLsWaiYj1hFo3zLFFSpg/oYS7Rpz/cdi38V3D38qD9r0e47Fh3cLuHv5UH7Xo+rF/mI9cRz67k/lzPUMJhrsYji+RZdcN1GM00y1muEbNRmyrlH3yj3JT7VKIA8TpvEUmOwUlSeHnCiLsPhyZEVwD+lkkfm0WGUwG6hyDP4iYjU1LaSp6DSLQ6hKPHmahIII7h6527uupouwZzJyAP5Oe4RBd9k0k2eYo/xYd5jh8PMW9wONoxKkkoscltZbL1rLiKK0do2rdiKye5SUKJWpQ6FW3UhOq/8qnhnbwMvtM7qq5x2psnRKskMDtPR0pwczgWR3tLUVLbc+CQrbvB1Y9fluHrqJDlLlFbURltKQ5KnWDbFtOSQB2UdtJUmE0obguqUp0g7AJ79bfC6ws3IT8jFpFY6mIhxaqShumn5Vc3zcylxUuL+7R1E7rjOHYL9ZtQ5ijUrVOsawmzyqJS/W1JOZI3U7eGhhYbPb5al2qexWpuoDQAZAHfXsO+rhNdGnNmzsLsZC02dTwumTid3EXFYmnnbn79DnY9fmKh8p18bxXEHxzNcNuGrwPi1bII/NL0kXao1ExB/sPexiwq+EJLKkzAf4H2hxCZ6NOf7jsW/iu4e/lQftej3HYt/Fdw9/Kg/a9d+rF/mI9cRH67k/lzPUMJhrYrYM2ynNQa6HImS3lcrTEdouOLV7EpSCSfm06DOJU0UhTfCrhwj2KeebcH6ckjXsZC3StPQIuV4BiDSjyORaZ+M26o/e8sQLdUfk8dSTdZzXOQB/J/ARFV9jKXImKP8SPExDuAfDB/BbOPIyEobzK6UiviQkKSpVRHfIQ686RvyvrQopSgHdCVKKupAFC8bLkZDxey24Q4HGpNvJLKh3dkHClv9EJ01NZdYzikyHcS4uTconssM3cllmBFjvufAWpiQrtlNHqS4pCQANwPHWkZ+GKPMuPwJKj1J7Ov6n8enTbJZ5qUy7PNSycyo4XJ3Uyp85xXkW61yFqm2uSp1MwQMTAPnXMu//jQtfAOm9P8AGrDqooC23LeOt1J8W0LC1/opVpoZUlm2hW8yWwVpyDJq2Iv/AHSpSpr4/o4x1hg3mN1sjzuomcF6qaELQ3LgrgMvtBSSlXItJ3SSlRG49uuVd3ddAxiOxU39NarqYtvdzhXTESUs7xm4UcKUncAkyXSB39NS2SbHY5oMxKlLwgYS9HcxEzl2+8JBEpaUIxE4ktUhhCr5jYrt8st7RxXMqXNde3/lLJ1ydGjWHHpYl3CRsozaLbrWtuNTJVZSVIUAooaHNyJJ6cy1cqE/KoabNV1kWHMMUMWwRHskpVLvnWmWT29nIUXpB3CTuEKWGh7A3qmfJ5gVNB6FuMmfEGFYSzYLdeaeLbrUQ7x2T2ba90uSuRZ/BjH2jexpEzGZMh2TJ4iUbr7y1OOuKizt1rUd1E/5v4knW5cfREzVTLSQwFAfby98ea+kvT1yUyrEkuS5I0A05+6O774OZ/6+d/oGv1NHvg5n/r53+ga/U1H+2xP+MCh+qzv2fR22J/xgUP1Wd+z69N0q5/2dw8o8V0L6QbpnefOJD74Wabben3th4dg1+prr4fnOSSL9py4v3U1EJt2dYqMZogRmEKdc32R3EJ5fp1B+2xP+MCh+qzv2fXqXcYfFx6dUDKkzl3z8Stlu1kSXvDrlPpXMcXzMg7FtsNgDc+v7N9VbdbLsTZ1mUElTUYDPu0i9dl330q1yxPKwh6uTkK79com+Hzskr63FqKpl11TdZG27f3T5ithIfmuLkBKwtJ5ezb2TsNu4DUizaTnmM0S7KZndLMRzpbEduIwVr379hyEEAdTv4DUHtratzTOp7lM5BvrG0lcsFh1ExiPEitoUpb8hQaSQENtJSEJO6lOD2a4dZkGGvVWO3CJTOO26N37aH2E14sKC90IbCmTzK5B16kcx27huc+zzbBLMuUSmgqSlJBOZ6xrwyjWtVnvOaJs4JVVXVAUoEDIHCKcc4l72PvUdrWW8TJXcZmXMRqZ6FpsdYluiQUFDr6EOAtsh1IRzJSn1ikk9d9bPnGWWNimkrM3ly7V4EM12S4xHhsyCASUh6KEuNK2BIVsobjYjrrl5XnuPWmX2N3ZrjMx7WvRFdp7+JNhSGGlJQShQS337g+shRBCj166zU2bQV37V8mLYPxYVUqsgP01VKeh1SA2UIWpS0hx3bmO4bStQBKjsBqmqTYVJKiRUPRWSjphbIRoptF5JWEAEspqpzSM1YnzMdBmXfoU/Ha4kXk4xVdm8aDDIbkRpXilK3gtatu7mUrrtvrEtpi6oXbrLMynZXjdfLbCqNWOR4apMgBS2xKca6KZCglWw2SSAFA9xj2OZtjtKisLM3FptpVKf9HzFicXWlOjZWzaWgFq8BuN/DW1FzXD/AHsX8UavpECfLtu0s3p1ZLaU40NjzJSGiSNwNgdidiSBvsGdGu9K2KgzgA4ncak0pC+l3qpGIJL4SSMDMdAHNePCsTXFclnHE7K6vbF6DHjxNo8dugZTEaU6vkaU0SAXSnYnlHTYdSduvB4h4lTycox+yt8rWLabSttBt3EIc5soLi3AotLSeRxRPL6oJ2TtqOV+Z4xbYxEh2uRPQG5mRSLOzhS4MvniR0qDMZhtIaIO0dCTsDtzH6dYOMmc1V/ZW0ugyF9t23eiVkaTBhSw5WwOdJkSFbtAo9VO2yd1fdFADv1GZMsU5BWoAZnCGBpRIdnrUnhnHZMm8JEwS0kn7oxFyK1UpiWowA45NHSp8ajybc1tCxjOQW5QQmqyPB4Veh3bqooejoCmylO6tlJVzBJHQnfXxWKVUiTIbj28GU625yOrpOGlc5BaV4pT2iFOKA9vMd9t9TTFMhxS7zLKsnhZJH82r6hEWChpmQuVGZUA0l8tOIStQBB3I3+Edz465FLYLx6gQ1SZBjFlKjpd9HrarHl2KVO9FJRuByE+JO+23jpsq7rPPGKUCfu0csCamoScqU7YXPva1WY4J6gKqLsHIFE9UqGda9kQ+YipoJ1TYV9vS20TzyQqa3LwetitqiRY6nnlpW23zjcllsHp1dHjrV4SWdnd45NtsqXHtK+jrW7n0S4kCOZsx9aIgdbTslTbTTfOEkd7oPgDqH8abUVGFWqG3vW7BrHmFJcCkrdU551Yd3eUERWSru3QoeB1OcEzJNHgkxqBepp02VqZ7VguI47FlxFRm2mmO1S2tKFshvs1NLCT0ChuDrM2cjpuBJGAHU0YcePZrGuJtpN3bRYO0KfwioJyYPo+T6RPqDMLCdVsvz+LjFK+dwYSKkENAEgDdKQO7Y9PbrFZ0l5mNXKtZWeY88mjlMyoV6pkLfghK/um7aUoUUutcyC0pXKrm28NcU8WKlbHZLd4aOqKeUrNY+pSj7dg3tv9GuZEua2vwK1pn/S1WmyfYfFtMq30QpKG+vZDZBca2KuZK3UJSvYhPdudyeuxTEFJUkOQKYSwerEJBDDUx5qzS7wlzAsIWrCCa4w5agIKiC5zAEdoGzg4wlPu8y002+6HZGEQFwCSeh2UnflPs5t/l1q2uHIiv1xyfJMajTrdK5EdmnwGBIjIY5iGlAutl310gK2O5BJHXbc6T+Y4A8xDiclc3HStCJbsVdnPIb7iey5AlI8d9+m3Tfu1mznLK7JcwdkYlfLb7XsI8Z+JGfQ5W17Ce2kP7utJQhXK0UJBJ3Lu2x66oTpN3JqCaAlnFcgA4euvZpGrItF7LopIDlIfCaZlRY4aaduRjGxi+OyK20sGsjbS3V9l5y27w7p+1HOrkBA7MdObwOxG+vnuSksV78u7Xi1ZTtSktU8+Lg1c7PvA6hCwosqRyIQ3vygpAKiTv3AHi4PxQZvq25fushs3KS+hSoqn51S0pbViwtlbBcciMghK0LX8IHYoO2ttvOIreQ4mmXbvOwYbzUd62j1kpcWtiNbuKQk9kCZDpAQFAHlB37yOVIRYFyzMqGP3XqQwypveu6LCpl5y5oksFOPvNQFzU/1yGpiy6bG4VHAi8OMWuvRrkClfkTDNp2VDtXgpwuvLHwOUuAhCeg6JB27oljCH8axdFfj/ABEyxFREZEbzqvwuvSwtKEgblakFR7tyVK3PeToRnlDIk5o/6Qkuyr9pQFlGrJjsSvY5wA2+vsQpHOk8oISQOXrt031cf4gVNW2EUUrH13LkFNcZsSLNlyXGQrm5Qx2RQokn2dfHVjY2JQHWBZh94J0cl2c1LamkVBaLxST1VAHEfulRzZIZ2FA5yFYy4/Q2VIl7KYmZ1FbEuFJaYsoNGX7O2WCQptUV1amWVIVuCpIUFeqRy77HsyncxcnR6iNmNk5ZTPVjQcoxWNDjyT96HoqUutn2KAUN9gR11ycqzWnsZeOSMhC6pytilqRVXEZ6GXXCokutuRkKb2V6p2QrdJTsrrvrYxvNsYYyZq9iUUqRDitr7KVXwrCwZhulJCXHXHACU9eqW0rV47AAnURZ7vEoqxVrqKbhodz0iZtV6meEhDAEaGtBiOo3t1o6cc5OJEmFF4h39k5DX2cj3PYXDdisrHegLeC1q26jmKjvtvqvONy7y1wufS2OR2E1iRXyp0Z9+qRWyUqilorZkNt7NuNKS6ClxIBCklJB3B12WswwQNSO3GPmY8tSueDPso6Qo92zQaPcfDVf8Y8kXW4XLVPlzS5LqVU9WxNbW2/IS9IQ/Ikdm567bKexaQjmAKyVq2A20q2yLFLkvJU6qag9poT7odd9pvCbPaelksdCG3CoHvhZNGjRrHjfiQVma5fWQW4Ndk1tEitDZtlmUtCE/MAdtbHviZ58cLz6659ujRogg98TPPjhefXXPt0e+JnnxwvPrrn26NGiCD3xM8+OF59dc+3QeIedkbHMLzb/AOa59ujRogjx7v8AOPjdefXnPt0e7/OPjdefXnPt0aNEEfWOIGcMc3ZZdeI5juraa51P49aU/Ksmny25czIbWRIaO7bjktZUg/Id+mjRogjf98TPOTk92F5y7bbeeufbrx7v84+N159ec+3Ro0QQe7/OPjdefXnPt0e7/OPjdefXnPt0aNEEdzHOK1/A7NNz2152ClKjPuzn2JUYqGyg2+0tKwlXTdBJSdgdumu9K40rfYU0/S2spChsWpWUz1tn50hwbj5N9GjRA0V9meWW2VzGHbEsMx4jXYw4cVoNR4re+/I2gdEjcknxJO51q0eRX1GVGmubCv5vhCNIU2D84B0aNEEddXEjP1Ag5lekH/bV/brmRspyWNYrsY+QWjUxfw30y1havnO/XRo0QR0HOIedubc+YXh2/wBtc+3WvMzbMJkV2LKyi4fYdTyuNrmLKVD2Eb9Ro0aII1KTI7+kacap7qwr23SFOJjSFNhR9pAPXXQ93+cfG68+uufbo0aII8rzzNlgBWWXZ2O4/wA9c7/x69yeIGcSWFMP5dduNqGykma5sR+PRo0QRrVOY5XUtKarMktojajuUNS1pBPt2B15n5dlU+Q3Im5HbPvNHdta5ayUH5OvTRo0QRu++JnnJye7C95dttvPnPt1Hp0yXOkqkzZT0l9fwnHnCtR+cnro0aIIwaNGjRBH/9k=";

const STATUSES = ["Upcoming","Bidding","Submitted","Awarded","Lost"];
const STATUS_COLORS: Record<string,string> = {
  Upcoming:"#4a9eff", Bidding:"#f5c842", Submitted:"#a78bfa", Awarded:"#2ecc71", Lost:"#ff5252"
};
const BADGE_CLASS: Record<string,string> = {
  Upcoming:"badge-upcoming", Bidding:"badge-bidding", Submitted:"badge-submitted",
  Awarded:"badge-awarded", Lost:"badge-lost"
};
const PM_COLORS: Record<string,{bg:string,text:string}> = {
  lm3:{bg:"#4a9eff",text:"#000"}, lm:{bg:"#4a9eff",text:"#000"},
  md:{bg:"#ff5252",text:"#000"}, ad:{bg:"#ffffff",text:"#000"},
};

function getPMColor(pm:string){
  if(!pm) return {bg:"var(--surface3)",text:"var(--text2)"};
  return PM_COLORS[pm.toLowerCase().replace(/\s/g,"")] || {bg:"var(--surface3)",text:"var(--text2)"};
}

function fmtPrice(p:any){
  if(p===null||p===undefined||p==="") return "—";
  const n=parseFloat(String(p).replace(/[^0-9.]/g,""));
  if(isNaN(n)||n===0) return "—";
  return "$"+n.toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:0});
}
function fmtDate(d:string){
  if(!d) return "—";
  const dt=new Date(d+"T00:00:00");
  return dt.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"2-digit"});
}
function dueDateClass(d:string){
  if(!d) return "";
  const diff=(new Date(d).getTime()-Date.now())/(86400000);
  if(diff<0||diff<=3) return "urgent";
  if(diff<=7) return "soon";
  return "";
}

// API helpers
async function apiFetch(path:string, opts?:RequestInit){
  const r = await fetch(path, {headers:{"Content-Type":"application/json"},...opts});
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}
const apiGet = (path:string) => apiFetch(path);
const apiPost = (path:string, body:any) => apiFetch(path,{method:"POST",body:JSON.stringify(body)});
const apiPatch = (path:string, body:any) => apiFetch(path,{method:"PATCH",body:JSON.stringify(body)});
const apiDelete = (path:string) => apiFetch(path,{method:"DELETE"});

const EMPTY_JOB = {
  projectName:"",gc:"",location:"",scope:"",estimator:"",status:"Upcoming",
  bidDueDate:"",takeoffDate:"",bidPrice:"",notes:"",contactName:"",
  contactEmail:"",followUpDate:"",submissionDate:""
};

// ── ICONS ──────────────────────────────────────────────────────────────────
function Icon({name,size=14}:{name:string,size?:number}){
  const s={width:size,height:size,fill:"none",stroke:"currentColor",strokeWidth:2,viewBox:"0 0 24 24"} as any;
  const icons:Record<string,any>={
    kanban:<svg {...s}><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="11" rx="1"/></svg>,
    table:<svg {...s}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/></svg>,
    plus:<svg {...s} strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    search:<svg {...s}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    upload:<svg {...s}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    map:<svg {...s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    user:<svg {...s}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    calendar:<svg {...s}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    edit:<svg {...s}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash:<svg {...s}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    check:<svg {...s} strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>,
    building:<svg {...s}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    dollar:<svg {...s}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    x:<svg {...s} strokeWidth={2.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    refresh:<svg {...s}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  };
  return icons[name]||null;
}

function StatusBadge({status}:{status:string}){
  return <span className={`badge ${BADGE_CLASS[status]||"badge-upcoming"}`}>{status}</span>;
}

// ── TOAST ───────────────────────────────────────────────────────────────────
function Toast({toasts}:{toasts:any[]}){
  return(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:200,display:"flex",flexDirection:"column",gap:8}}>
      {toasts.map(t=>(
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type==="success"&&<Icon name="check" size={14}/>}
          {t.type==="error"&&<Icon name="x" size={14}/>}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ── JOB FORM ────────────────────────────────────────────────────────────────
function JobForm({job,onSave,onCancel,isEdit}:{job:any,onSave:(f:any)=>void,onCancel:()=>void,isEdit:boolean}){
  const [form,setForm]=useState(job||EMPTY_JOB);
  const set=(k:string,v:any)=>setForm((f:any)=>({...f,[k]:v}));
  return(
    <>
      <div className="modal-body">
        <div className="form-section">
          <div className="form-section-title">Project Details</div>
          <div className="form-grid">
            <div className="form-group full"><label>Project Name *</label><input className="form-input" value={form.projectName} onChange={e=>set("projectName",e.target.value)} placeholder="e.g. Riverside Medical Center"/></div>
            <div className="form-group"><label>GC / Contractor</label><input className="form-input" value={form.gc||""} onChange={e=>set("gc",e.target.value)}/></div>
            <div className="form-group"><label>Location</label><input className="form-input" value={form.location||""} onChange={e=>set("location",e.target.value)} placeholder="City, ST"/></div>
            <div className="form-group full"><label>Scope of Work</label><input className="form-input" value={form.scope||""} onChange={e=>set("scope",e.target.value)}/></div>
          </div>
        </div>
        <div className="form-section">
          <div className="form-section-title">Bid Info</div>
          <div className="form-grid">
            <div className="form-group"><label>Status</label>
              <select className="form-select" value={form.status} onChange={e=>set("status",e.target.value)}>
                {STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Estimator / PM</label><input className="form-input" value={form.estimator||""} onChange={e=>set("estimator",e.target.value)}/></div>
            <div className="form-group"><label>Bid Due Date</label><input type="date" className="form-input" value={form.bidDueDate||""} onChange={e=>set("bidDueDate",e.target.value)}/></div>
            <div className="form-group"><label>Takeoff Date</label><input type="date" className="form-input" value={form.takeoffDate||""} onChange={e=>set("takeoffDate",e.target.value)}/></div>
            <div className="form-group"><label>Bid Price ($)</label><input type="number" className="form-input" value={form.bidPrice||""} onChange={e=>set("bidPrice",e.target.value)}/></div>
            <div className="form-group"><label>Submission Date</label><input type="date" className="form-input" value={form.submissionDate||""} onChange={e=>set("submissionDate",e.target.value)}/></div>
          </div>
        </div>
        <div className="form-section">
          <div className="form-section-title">Contact</div>
          <div className="form-grid">
            <div className="form-group"><label>Contact Name</label><input className="form-input" value={form.contactName||""} onChange={e=>set("contactName",e.target.value)}/></div>
            <div className="form-group"><label>Contact Email</label><input type="email" className="form-input" value={form.contactEmail||""} onChange={e=>set("contactEmail",e.target.value)}/></div>
            <div className="form-group"><label>Follow-Up Date</label><input type="date" className="form-input" value={form.followUpDate||""} onChange={e=>set("followUpDate",e.target.value)}/></div>
          </div>
        </div>
        <div className="form-group"><label>Notes</label><textarea className="form-textarea" value={form.notes||""} onChange={e=>set("notes",e.target.value)} rows={3}/></div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={()=>{if(!form.projectName.trim()){alert("Project Name required");return;}onSave(form);}}><Icon name="check" size={12}/>{isEdit?"Save Changes":"Create Job"}</button>
      </div>
    </>
  );
}

// ── JOB DETAIL ──────────────────────────────────────────────────────────────
function JobDetail({job,onEdit,onDelete,onClose}:{job:any,onEdit:()=>void,onDelete:()=>void,onClose:()=>void}){
  return(
    <>
      <div className="modal-body">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <StatusBadge status={job.status}/>
          {job.estimator&&<span style={{fontSize:12,color:"var(--text2)",fontFamily:"var(--font-mono)"}}>{job.estimator}</span>}
          {job.bid_price&&<span style={{fontSize:13,fontFamily:"var(--font-mono)",color:"var(--green)",marginLeft:"auto"}}>{fmtPrice(job.bid_price)}</span>}
        </div>
        <div className="detail-grid">
          <div className="detail-field full"><div className="detail-label">GC / Contractor</div><div className="detail-val">{job.gc||<span style={{color:"var(--text3)",fontStyle:"italic",fontSize:12}}>Not set</span>}</div></div>
          <div className="detail-field full"><div className="detail-label">Scope of Work</div><div className="detail-val">{job.scope||<span style={{color:"var(--text3)",fontStyle:"italic",fontSize:12}}>Not set</span>}</div></div>
          <div className="detail-field"><div className="detail-label">Location</div><div className="detail-val">{job.location||<span style={{color:"var(--text3)",fontStyle:"italic",fontSize:12}}>Not set</span>}</div></div>
          <div className="detail-field"><div className="detail-label">Estimator / PM</div><div className="detail-val">{job.estimator||<span style={{color:"var(--text3)",fontStyle:"italic",fontSize:12}}>Not set</span>}</div></div>
          <div className="detail-field"><div className="detail-label">Bid Due Date</div><div className={`detail-val mono ${dueDateClass(job.bid_due_date)}`}>{fmtDate(job.bid_due_date)}</div></div>
          <div className="detail-field"><div className="detail-label">Takeoff Date</div><div className="detail-val mono">{fmtDate(job.takeoff_date)}</div></div>
          <div className="detail-field"><div className="detail-label">Submission Date</div><div className="detail-val mono">{fmtDate(job.submission_date)}</div></div>
          <div className="detail-field"><div className="detail-label">Follow-Up Date</div><div className="detail-val mono">{fmtDate(job.follow_up_date)}</div></div>
        </div>
        {job.notes&&<div><div className="detail-label" style={{marginBottom:6}}>Notes</div><div style={{fontSize:13,color:"var(--text2)",lineHeight:1.6,background:"var(--surface2)",padding:"12px 14px",borderRadius:"var(--radius)"}}>{job.notes}</div></div>}
      </div>
      <div className="modal-footer">
        <button className="btn btn-danger btn-sm" onClick={onDelete}><Icon name="trash" size={12}/>Delete</button>
        <div style={{flex:1}}/>
        <button className="btn btn-ghost" onClick={onClose}>Close</button>
        <button className="btn btn-primary" onClick={onEdit}><Icon name="edit" size={12}/>Edit</button>
      </div>
    </>
  );
}

// ── KANBAN CARD ─────────────────────────────────────────────────────────────
function KanbanCard({job,onClick,onStatusChange,onPriceUpdate}:{job:any,onClick:()=>void,onStatusChange:(s:string)=>void,onPriceUpdate:(id:string,p:string)=>void}){
  const dc=dueDateClass(job.bid_due_date);
  const hasName=job.project_name&&job.project_name!=="Unnamed Import"&&job.project_name!=="Unnamed";
  const [editingPrice,setEditingPrice]=useState(false);
  const [priceInput,setPriceInput]=useState("");
  const priceRef=useRef<HTMLInputElement>(null);

  const startPrice=(e:any)=>{e.stopPropagation();setPriceInput(job.bid_price||"");setEditingPrice(true);setTimeout(()=>priceRef.current?.focus(),30);};
  const commitPrice=(e:any)=>{e.stopPropagation();onPriceUpdate(job.id,priceInput);setEditingPrice(false);};
  const pmColor=getPMColor(job.estimator||"");

  return(
    <div className={`job-card ${job.status?.toLowerCase()||"upcoming"}`} onClick={onClick} draggable
      onDragStart={e=>e.dataTransfer.setData("jobId",job.id)} style={{minHeight:90}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
        <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)",fontWeight:600,letterSpacing:"0.5px"}}>{job.job_number}</span>
        {job.estimator&&<span style={{fontSize:10,fontFamily:"var(--font-mono)",fontWeight:700,background:pmColor.bg,color:pmColor.text,padding:"2px 8px",borderRadius:4,letterSpacing:"0.5px"}}>{job.estimator.toUpperCase()}</span>}
      </div>
      <div style={{fontFamily:"var(--font-display)",fontSize:15,fontWeight:700,color:hasName?"var(--text)":"var(--text3)",lineHeight:1.35,marginBottom:hasName?8:0,fontStyle:hasName?"normal":"italic"}}>
        {hasName?job.project_name:"No name — click to edit"}
      </div>
      {job.location&&<div style={{fontSize:12,color:"var(--text2)",display:"flex",alignItems:"center",gap:4,marginBottom:5}}><Icon name="map" size={10}/>{job.location}</div>}
      {job.gc&&<div style={{fontSize:12,color:"var(--text2)",display:"flex",alignItems:"center",gap:4,marginBottom:5}}><Icon name="building" size={10}/>{job.gc}</div>}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap",marginTop:10,paddingTop:10,borderTop:"1px solid var(--border)"}}>
        {job.bid_due_date
          ?<span className={`due-date ${dc}`} style={{display:"flex",alignItems:"center",gap:4}}><Icon name="calendar" size={10}/>{fmtDate(job.bid_due_date)}</span>
          :<span style={{fontSize:10,fontFamily:"var(--font-mono)",color:"var(--text3)"}}>No due date</span>}
        {editingPrice
          ?<div style={{display:"flex",alignItems:"center",gap:4}} onClick={e=>e.stopPropagation()}>
            <span style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--font-mono)"}}>$</span>
            <input ref={priceRef} type="number" value={priceInput} onChange={e=>setPriceInput(e.target.value)}
              onBlur={commitPrice} onKeyDown={e=>{if(e.key==="Enter")commitPrice(e);if(e.key==="Escape"){e.stopPropagation();setEditingPrice(false);}}}
              style={{width:90,background:"var(--surface3)",border:"1px solid var(--accent)",borderRadius:4,color:"var(--green)",fontFamily:"var(--font-mono)",fontSize:12,padding:"2px 6px",outline:"none"}}/>
          </div>
          :<span onClick={startPrice} title="Click to add price"
            style={{fontSize:job.bid_price?14:11,fontFamily:"var(--font-mono)",color:job.bid_price?"var(--green)":"var(--text3)",fontWeight:job.bid_price?700:400,cursor:"pointer",borderBottom:job.bid_price?"none":"1px dashed var(--text3)"}}>
            {job.bid_price?fmtPrice(job.bid_price):"+ add price"}
          </span>}
      </div>
    </div>
  );
}

// ── KANBAN BOARD ────────────────────────────────────────────────────────────
function KanbanBoard({jobs,onCardClick,onStatusChange,onPriceUpdate}:{jobs:any[],onCardClick:(j:any)=>void,onStatusChange:(id:string,s:string)=>void,onPriceUpdate:(id:string,p:string)=>void}){
  const [dragOver,setDragOver]=useState<string|null>(null);
  return(
    <div className="kanban-board">
      {STATUSES.map(status=>{
        const cols=jobs.filter(j=>j.status===status);
        return(
          <div key={status} className="kanban-col">
            <div className="col-header">
              <div className="col-title"><div className="col-dot" style={{background:STATUS_COLORS[status]}}/>{status}</div>
              <span className="col-count">{cols.length}</span>
            </div>
            <div className={`kanban-cards${dragOver===status?" drag-over":""}`}
              onDragOver={e=>{e.preventDefault();setDragOver(status);}}
              onDragLeave={()=>setDragOver(null)}
              onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData("jobId");if(id)onStatusChange(id,status);setDragOver(null);}}>
              {cols.map(j=><KanbanCard key={j.id} job={j} onClick={()=>onCardClick(j)} onStatusChange={s=>onStatusChange(j.id,s)} onPriceUpdate={onPriceUpdate}/>)}
              {cols.length===0&&<div style={{textAlign:"center",padding:"20px",color:"var(--text3)",fontSize:12,fontFamily:"var(--font-mono)"}}>Drop here</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── TABLE VIEW ──────────────────────────────────────────────────────────────
function TableView({jobs,onRowClick}:{jobs:any[],onRowClick:(j:any)=>void}){
  const [sortKey,setSortKey]=useState("bid_due_date");
  const [sortDir,setSortDir]=useState("asc");
  const handleSort=(k:string)=>{if(sortKey===k)setSortDir(d=>d==="asc"?"desc":"asc");else{setSortKey(k);setSortDir("asc");}};
  const sorted=useMemo(()=>[...jobs].sort((a,b)=>{
    let av=a[sortKey]||"",bv=b[sortKey]||"";
    if(sortKey==="bid_price"){av=parseFloat(av)||0;bv=parseFloat(bv)||0;}
    return (av<bv?-1:av>bv?1:0)*(sortDir==="asc"?1:-1);
  }),[jobs,sortKey,sortDir]);
  const Th=({k,label}:{k:string,label:string})=>(
    <th onClick={()=>handleSort(k)} className={sortKey===k?"sorted":""}>
      {label}<span className="sort-icon">{sortKey===k?(sortDir==="asc"?"↑":"↓"):"↕"}</span>
    </th>
  );
  if(!jobs.length) return(
    <div className="table-wrap"><div className="empty-table">
      <div className="empty-table-icon">📋</div>
      <div className="empty-table-text">No jobs found</div>
      <div className="empty-table-sub">Adjust filters or create a new job</div>
    </div></div>
  );
  return(
    <div className="table-wrap">
      <table><thead><tr>
        <Th k="job_number" label="Job #"/><Th k="project_name" label="Project"/>
        <Th k="gc" label="GC"/><Th k="location" label="Location"/>
        <Th k="status" label="Status"/><Th k="estimator" label="PM"/>
        <Th k="bid_due_date" label="Due Date"/><Th k="bid_price" label="Bid Price"/>
      </tr></thead>
      <tbody>{sorted.map(j=>{
        const dc=dueDateClass(j.bid_due_date);
        return(<tr key={j.id} onClick={()=>onRowClick(j)}>
          <td className="td-jobnum">{j.job_number}</td>
          <td className="td-name">{j.project_name}</td>
          <td>{j.gc||"—"}</td><td>{j.location||"—"}</td>
          <td><StatusBadge status={j.status}/></td>
          <td>{j.estimator?<span style={{fontSize:11,fontWeight:700,background:getPMColor(j.estimator).bg,color:getPMColor(j.estimator).text,padding:"1px 7px",borderRadius:4,fontFamily:"var(--font-mono)"}}>{j.estimator.toUpperCase()}</span>:"—"}</td>
          <td className={`td-due ${dc}`}>{fmtDate(j.bid_due_date)}</td>
          <td className="td-price">{fmtPrice(j.bid_price)}</td>
        </tr>);
      })}</tbody></table>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [jobs,setJobs]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [view,setView]=useState("kanban");
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [filterEstimator,setFilterEstimator]=useState("All");
  const [modal,setModal]=useState<any>(null);
  const [toasts,setToasts]=useState<any[]>([]);
  const toastRef=useRef(0);

  const addToast=useCallback((msg:string,type="success")=>{
    const id=++toastRef.current;
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3000);
  },[]);

  const loadJobs=useCallback(async()=>{
    try{
      const params=new URLSearchParams();
      if(filterStatus!=="All") params.set("status",filterStatus);
      if(filterEstimator!=="All") params.set("estimator",filterEstimator);
      if(search) params.set("q",search);
      const data=await apiGet(`/api/jobs?${params}`);
      setJobs(data);
    }catch(e){addToast("Failed to load jobs","error");}
    finally{setLoading(false);}
  },[filterStatus,filterEstimator,search,addToast]);

  useEffect(()=>{loadJobs();},[loadJobs]);

  // Seed on first load
  useEffect(()=>{
    apiPost("/api/jobs/seed",{}).then(r=>{
      if(r.inserted>0){addToast(`Loaded ${r.inserted} jobs from your spreadsheet`,"success");loadJobs();}
    }).catch(()=>{});
  },[]);

  const allEstimators=useMemo(()=>["All",...Array.from(new Set(jobs.map((j:any)=>j.estimator).filter(Boolean))).sort()]as string[],[jobs]);

  const filteredJobs=useMemo(()=>{
    if(!search&&filterStatus==="All"&&filterEstimator==="All") return jobs;
    return jobs.filter(j=>{
      if(filterStatus!=="All"&&j.status!==filterStatus) return false;
      if(filterEstimator!=="All"&&j.estimator!==filterEstimator) return false;
      if(search){const q=search.toLowerCase();if(!j.project_name?.toLowerCase().includes(q)&&!j.job_number?.toLowerCase().includes(q)&&!j.gc?.toLowerCase().includes(q)&&!j.location?.toLowerCase().includes(q))return false;}
      return true;
    });
  },[jobs,filterStatus,filterEstimator,search]);

  const stats=useMemo(()=>({
    total:jobs.length,
    bidding:jobs.filter(j=>j.status==="Bidding").length,
    submitted:jobs.filter(j=>j.status==="Submitted").length,
    awarded:jobs.filter(j=>j.status==="Awarded").length,
    pipeline:jobs.filter(j=>j.status==="Awarded").reduce((s,j)=>s+(parseFloat(j.bid_price)||0),0),
  }),[jobs]);

  const createJob=async(form:any)=>{
    try{const j=await apiPost("/api/jobs",form);setJobs(p=>[j,...p]);setModal(null);addToast(`Job ${j.job_number} created`);}
    catch{addToast("Failed to create job","error");}
  };
  const updateJob=async(id:string,form:any)=>{
    try{const j=await apiPatch(`/api/jobs/${id}`,form);setJobs(p=>p.map(x=>x.id===id?j:x));setModal(null);addToast("Job updated");}
    catch{addToast("Failed to update","error");}
  };
  const deleteJob=async(id:string)=>{
    if(!confirm("Delete this job?")) return;
    try{await apiDelete(`/api/jobs/${id}`);setJobs(p=>p.filter(x=>x.id!==id));setModal(null);addToast("Job deleted","info");}
    catch{addToast("Failed to delete","error");}
  };
  const updateStatus=async(id:string,status:string)=>{
    setJobs(p=>p.map(j=>j.id===id?{...j,status}:j));
    try{await apiPatch(`/api/jobs/${id}`,{status});addToast(`Moved to ${status}`);}
    catch{addToast("Failed to update status","error");loadJobs();}
  };
  const updatePrice=async(id:string,price:string)=>{
    const val=price.replace(/[^0-9.]/g,"");
    setJobs(p=>p.map(j=>j.id===id?{...j,bid_price:val?parseFloat(val):null}:j));
    try{await apiPatch(`/api/jobs/${id}`,{bidPrice:val});}
    catch{addToast("Failed to save price","error");loadJobs();}
  };

  return(
    <>
      <style>{`
        :root{--bg:#0e0f11;--surface:#16181c;--surface2:#1e2128;--surface3:#252830;--border:#2a2d35;--border2:#353840;--accent:#f07b2a;--accent2:#e05e10;--accent-dim:rgba(240,123,42,0.12);--text:#e8eaf0;--text2:#9aa0b0;--text3:#5c6270;--green:#2ecc71;--green-dim:rgba(46,204,113,0.12);--blue:#4a9eff;--blue-dim:rgba(74,158,255,0.12);--yellow:#f5c842;--yellow-dim:rgba(245,200,66,0.12);--red:#ff5252;--red-dim:rgba(255,82,82,0.12);--purple:#a78bfa;--purple-dim:rgba(167,139,250,0.12);--radius:8px;--radius-lg:14px;--shadow:0 4px 24px rgba(0,0,0,0.5);--font-display:'Syne',sans-serif;--font-mono:'DM Mono',monospace;--font-body:'DM Sans',sans-serif;}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{font-size:14px;}body{background:var(--bg);color:var(--text);font-family:var(--font-body);min-height:100vh;overflow-x:hidden;}
        ::-webkit-scrollbar{width:6px;height:6px;}::-webkit-scrollbar-track{background:var(--surface);}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px;}
        .app{display:flex;height:100vh;overflow:hidden;}
        .sidebar{width:200px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;}
        .main{flex:1;overflow:hidden;display:flex;flex-direction:column;}
        .topbar{height:56px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 20px;gap:12px;flex-shrink:0;}
        .content{flex:1;overflow:auto;padding:24px;}
        .logo{padding:16px 14px;border-bottom:1px solid var(--border);}
        .nav{padding:12px 8px;flex:1;}
        .nav-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:var(--radius);cursor:pointer;color:var(--text2);font-size:13px;font-weight:500;transition:all 0.15s;margin-bottom:2px;border:none;background:none;width:100%;text-align:left;font-family:var(--font-body);}
        .nav-item:hover{background:var(--surface2);color:var(--text);}.nav-item.active{background:var(--accent-dim);color:var(--accent);}
        .sidebar-stats{padding:12px;border-top:1px solid var(--border);}
        .stat-row{display:flex;justify-content:space-between;align-items:center;padding:5px 4px;}
        .stat-label{font-size:11px;color:var(--text3);font-family:var(--font-mono);}
        .stat-val{font-size:12px;font-weight:600;color:var(--text2);font-family:var(--font-mono);}
        .search-wrap{flex:1;max-width:380px;position:relative;}
        .search-wrap svg{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3);pointer-events:none;}
        .search-input{width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:7px 12px 7px 34px;border-radius:var(--radius);font-size:13px;font-family:var(--font-body);outline:none;transition:border-color 0.15s;}
        .search-input:focus{border-color:var(--accent);}.search-input::placeholder{color:var(--text3);}
        .filter-select{background:var(--surface2);border:1px solid var(--border);color:var(--text2);padding:6px 10px;border-radius:var(--radius);font-size:12px;font-family:var(--font-mono);outline:none;cursor:pointer;}
        .filter-select option{background:var(--surface2);}
        .btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--radius);font-size:12px;font-weight:600;font-family:var(--font-display);letter-spacing:0.3px;cursor:pointer;border:none;transition:all 0.15s;white-space:nowrap;}
        .btn-primary{background:var(--accent);color:#fff;}.btn-primary:hover{background:var(--accent2);transform:translateY(-1px);}
        .btn-ghost{background:var(--surface2);color:var(--text2);border:1px solid var(--border);}.btn-ghost:hover{background:var(--surface3);color:var(--text);}
        .btn-sm{padding:5px 10px;font-size:11px;}.btn-danger{background:var(--red-dim);color:var(--red);border:1px solid rgba(255,82,82,0.2);}
        .view-toggle{display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
        .view-btn{padding:6px 10px;border:none;background:none;color:var(--text3);cursor:pointer;display:flex;align-items:center;transition:all 0.15s;}
        .view-btn.active{background:var(--accent);color:#fff;}.view-btn:hover:not(.active){background:var(--surface3);color:var(--text);}
        .badge{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:100px;font-size:10.5px;font-weight:600;font-family:var(--font-mono);letter-spacing:0.3px;white-space:nowrap;}
        .badge::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0;}
        .badge-upcoming{background:var(--blue-dim);color:var(--blue);}.badge-bidding{background:var(--yellow-dim);color:var(--yellow);}
        .badge-submitted{background:var(--purple-dim);color:var(--purple);}.badge-awarded{background:var(--green-dim);color:var(--green);}.badge-lost{background:var(--red-dim);color:var(--red);}
        .kanban-board{display:flex;gap:20px;height:100%;overflow-x:auto;padding-bottom:8px;}
        .kanban-col{flex-shrink:0;width:420px;display:flex;flex-direction:column;gap:10px;}
        .col-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:var(--radius);background:var(--surface);border:1px solid var(--border);}
        .col-title{display:flex;align-items:center;gap:8px;font-family:var(--font-display);font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;}
        .col-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}.col-count{font-family:var(--font-mono);font-size:11px;color:var(--text3);background:var(--surface2);padding:2px 7px;border-radius:100px;}
        .kanban-cards{flex:1;display:flex;flex-direction:column;gap:14px;min-height:80px;padding:4px 2px;border-radius:var(--radius);transition:background 0.15s;}
        .kanban-cards.drag-over{background:var(--accent-dim);outline:2px dashed var(--accent);outline-offset:-2px;}
        .job-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;cursor:pointer;transition:all 0.15s;user-select:none;position:relative;overflow:visible;word-break:break-word;}
        .job-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:3px 0 0 3px;}
        .job-card.upcoming::before{background:var(--blue);}.job-card.bidding::before{background:var(--yellow);}
        .job-card.submitted::before{background:var(--purple);}.job-card.awarded::before{background:var(--green);}.job-card.lost::before{background:var(--red);}
        .job-card:hover{border-color:var(--border2);background:var(--surface2);transform:translateY(-2px);box-shadow:var(--shadow);}
        .due-date{font-family:var(--font-mono);font-size:10px;color:var(--text3);}.due-date.urgent{color:var(--red);}.due-date.soon{color:var(--yellow);}
        .table-wrap{overflow:auto;border-radius:var(--radius-lg);border:1px solid var(--border);}
        table{width:100%;border-collapse:collapse;font-size:12.5px;}thead{position:sticky;top:0;z-index:2;}
        th{background:var(--surface);color:var(--text3);font-family:var(--font-mono);font-size:10px;font-weight:500;letter-spacing:0.8px;text-transform:uppercase;padding:10px 14px;text-align:left;white-space:nowrap;cursor:pointer;border-bottom:1px solid var(--border);transition:color 0.1s;user-select:none;}
        th:hover{color:var(--text);}.th.sorted,.sorted{color:var(--accent);}
        .sort-icon{display:inline;margin-left:4px;opacity:0.5;}.sorted .sort-icon{opacity:1;}
        td{padding:10px 14px;border-bottom:1px solid var(--border);color:var(--text2);vertical-align:middle;white-space:nowrap;}
        tr{transition:background 0.1s;cursor:pointer;}tr:hover td{background:var(--surface2);}tr:last-child td{border-bottom:none;}
        .td-jobnum{font-family:var(--font-mono);font-size:11px;color:var(--accent);font-weight:500;}
        .td-name{font-weight:600;color:var(--text);max-width:220px;overflow:hidden;text-overflow:ellipsis;}
        .td-price{font-family:var(--font-mono);color:var(--green);font-size:12px;}
        .td-due{font-family:var(--font-mono);font-size:11px;}.td-due.urgent{color:var(--red);}.td-due.soon{color:var(--yellow);}
        .empty-table{text-align:center;padding:60px 20px;color:var(--text3);}
        .empty-table-icon{font-size:40px;margin-bottom:12px;opacity:0.3;}.empty-table-text{font-family:var(--font-display);font-size:16px;font-weight:600;margin-bottom:6px;}.empty-table-sub{font-size:12px;}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.15s;}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        .modal{background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius-lg);width:100%;max-width:680px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 80px rgba(0,0,0,0.7);animation:slideUp 0.2s;}
        @keyframes slideUp{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
        .modal-header{padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;position:sticky;top:0;background:var(--surface);z-index:1;}
        .modal-jobnum{font-family:var(--font-mono);font-size:11px;color:var(--accent);letter-spacing:0.5px;margin-bottom:4px;}
        .modal-title{font-family:var(--font-display);font-size:18px;font-weight:800;color:var(--text);}
        .modal-close{background:var(--surface2);border:1px solid var(--border);color:var(--text2);width:32px;height:32px;border-radius:var(--radius);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.15s;font-size:16px;}
        .modal-close:hover{background:var(--surface3);color:var(--text);}
        .modal-body{padding:20px 24px;}.modal-footer{padding:14px 24px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px;position:sticky;bottom:0;background:var(--surface);}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}.form-group{display:flex;flex-direction:column;gap:5px;}.form-group.full{grid-column:1/-1;}
        label{font-family:var(--font-mono);font-size:10px;font-weight:500;color:var(--text3);letter-spacing:0.8px;text-transform:uppercase;}
        .form-input,.form-select,.form-textarea{background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:8px 12px;border-radius:var(--radius);font-size:13px;font-family:var(--font-body);outline:none;transition:border-color 0.15s;width:100%;}
        .form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--accent);}.form-input::placeholder{color:var(--text3);}
        .form-select option{background:var(--surface2);}.form-textarea{resize:vertical;min-height:80px;}
        .form-section{margin-bottom:20px;}.form-section-title{font-family:var(--font-display);font-size:11px;font-weight:700;color:var(--text3);letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border);}
        .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;}
        .detail-field.full{grid-column:1/-1;}.detail-label{font-family:var(--font-mono);font-size:9.5px;color:var(--text3);letter-spacing:0.8px;text-transform:uppercase;margin-bottom:4px;}
        .detail-val{font-size:13px;color:var(--text);font-weight:500;}.detail-val.mono{font-family:var(--font-mono);}
        .toast{background:var(--surface2);border:1px solid var(--border2);border-radius:var(--radius);padding:12px 16px;font-size:13px;color:var(--text);box-shadow:var(--shadow);display:flex;align-items:center;gap:8px;animation:slideInRight 0.2s;max-width:320px;}
        @keyframes slideInRight{from{transform:translateX(20px);opacity:0;}to{transform:translateX(0);opacity:1;}}
        .toast-success{border-color:rgba(46,204,113,0.3);}.toast-error{border-color:rgba(255,82,82,0.3);}.toast-info{border-color:rgba(74,158,255,0.3);}
        .page-title{font-family:var(--font-display);font-size:22px;font-weight:800;color:var(--text);margin-right:8px;}
        .page-count{font-family:var(--font-mono);font-size:12px;color:var(--text3);background:var(--surface2);border:1px solid var(--border);padding:3px 9px;border-radius:100px;}
        input[type="file"]{display:none;}
        .loading{display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3);font-family:var(--font-mono);font-size:14px;gap:10px;}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet"/>

      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="logo">
            <img src={LOGO_SRC} alt="ACCI Roofing" style={{width:"100%",maxWidth:160,display:"block"}}/>
          </div>
          <nav className="nav">
            <button className={`nav-item${view==="kanban"?" active":""}`} onClick={()=>setView("kanban")}><Icon name="kanban" size={15}/><span>Pipeline</span></button>
            <button className={`nav-item${view==="table"?" active":""}`} onClick={()=>setView("table")}><Icon name="table" size={15}/><span>All Jobs</span></button>
          </nav>
          <div className="sidebar-stats">
            <div className="stat-row"><span className="stat-label">Total</span><span className="stat-val">{stats.total}</span></div>
            <div className="stat-row"><span className="stat-label">Bidding</span><span className="stat-val" style={{color:"var(--yellow)"}}>{stats.bidding}</span></div>
            <div className="stat-row"><span className="stat-label">Submitted</span><span className="stat-val" style={{color:"var(--purple)"}}>{stats.submitted}</span></div>
            <div className="stat-row"><span className="stat-label">Awarded</span><span className="stat-val" style={{color:"var(--green)"}}>{stats.awarded}</span></div>
            <div className="stat-row"><span className="stat-label">Pipeline</span><span className="stat-val" style={{color:"var(--green)",fontSize:10}}>{stats.pipeline>0?"$"+Math.round(stats.pipeline/1000)+"K":"—"}</span></div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <header className="topbar">
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span className="page-title">{view==="kanban"?"Pipeline":"All Jobs"}</span>
              <span className="page-count">{filteredJobs.length}</span>
            </div>
            <div className="search-wrap" style={{marginLeft:16}}>
              <Icon name="search" size={13}/>
              <input className="search-input" placeholder="Search jobs, GC, job#..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <select className="filter-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
              <option>All</option>{STATUSES.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="filter-select" value={filterEstimator} onChange={e=>setFilterEstimator(e.target.value)}>
              {allEstimators.map(e=><option key={e}>{e}</option>)}
            </select>
            <div style={{display:"flex",gap:8,marginLeft:"auto"}}>
              <div className="view-toggle">
                <button className={`view-btn${view==="kanban"?" active":""}`} onClick={()=>setView("kanban")}><Icon name="kanban" size={14}/></button>
                <button className={`view-btn${view==="table"?" active":""}`} onClick={()=>setView("table")}><Icon name="table" size={14}/></button>
              </div>
              <button className="btn btn-primary" onClick={()=>setModal({type:"create"})}><Icon name="plus" size={13}/>New Job</button>
            </div>
          </header>

          <div className="content">
            {loading
              ?<div className="loading"><Icon name="refresh" size={16}/>Loading jobs...</div>
              :view==="kanban"
                ?<KanbanBoard jobs={filteredJobs} onCardClick={j=>setModal({type:"detail",job:j})} onStatusChange={updateStatus} onPriceUpdate={updatePrice}/>
                :<TableView jobs={filteredJobs} onRowClick={j=>setModal({type:"detail",job:j})}/>
            }
          </div>
        </div>

        {/* MODALS */}
        {modal?.type==="create"&&(
          <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
            <div className="modal">
              <div className="modal-header">
                <div><div className="modal-jobnum">AUTO-GENERATE</div><div className="modal-title">New Bid Opportunity</div></div>
                <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
              </div>
              <JobForm job={EMPTY_JOB} onSave={createJob} onCancel={()=>setModal(null)} isEdit={false}/>
            </div>
          </div>
        )}

        {modal?.type==="detail"&&(()=>{
          const job=jobs.find(j=>j.id===modal.job.id)||modal.job;
          return(
            <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
              <div className="modal">
                <div className="modal-header">
                  <div><div className="modal-jobnum">{job.job_number}</div><div className="modal-title">{job.project_name||"Unnamed"}</div></div>
                  <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
                </div>
                <JobDetail job={job} onEdit={()=>setModal({type:"edit",job})} onDelete={()=>deleteJob(job.id)} onClose={()=>setModal(null)}/>
              </div>
            </div>
          );
        })()}

        {modal?.type==="edit"&&(()=>{
          const job=jobs.find(j=>j.id===modal.job.id)||modal.job;
          const formJob={
            projectName:job.project_name||"",gc:job.gc||"",location:job.location||"",
            scope:job.scope||"",estimator:job.estimator||"",status:job.status||"Upcoming",
            bidDueDate:job.bid_due_date||"",takeoffDate:job.takeoff_date||"",
            bidPrice:job.bid_price||"",notes:job.notes||"",contactName:job.contact_name||"",
            contactEmail:job.contact_email||"",followUpDate:job.follow_up_date||"",
            submissionDate:job.submission_date||"",
          };
          return(
            <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
              <div className="modal">
                <div className="modal-header">
                  <div><div className="modal-jobnum">{job.job_number}</div><div className="modal-title">Edit Job</div></div>
                  <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
                </div>
                <JobForm job={formJob} onSave={f=>updateJob(job.id,f)} onCancel={()=>setModal({type:"detail",job})} isEdit={true}/>
              </div>
            </div>
          );
        })()}

        <Toast toasts={toasts}/>
      </div>
    </>
  );
}
