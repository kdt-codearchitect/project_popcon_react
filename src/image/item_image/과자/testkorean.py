import sys
import io

# 인코딩 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 테스트 출력
print("안녕하세요, 한글 출력 테스트입니다.")